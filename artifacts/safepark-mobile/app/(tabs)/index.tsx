import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlertCard from '@/components/AlertCard';
import Colors from '@/constants/colors';
import { useAlerts } from '@/context/AlertsContext';

function NewAlertBanner({ visible, onPress }: { visible: boolean; onPress: () => void }) {
  const slideAnim = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : -80,
      useNativeDriver: true,
      tension: 80,
      friction: 9,
    }).start();
  }, [visible]);

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}>
      <Pressable style={styles.bannerContent} onPress={onPress}>
        <View style={styles.bannerDot} />
        <Feather name="alert-circle" size={16} color={Colors.critical} />
        <Text style={styles.bannerText}>Novo alerta crítico recebido</Text>
        <Feather name="chevron-down" size={16} color={Colors.text} />
      </Pressable>
    </Animated.View>
  );
}

export default function AlertasScreen() {
  const insets = useSafeAreaInsets();
  const { pendingAlerts, newAlertId, clearNew } = useAlerts();
  const listRef = useRef<FlatList>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const showBanner = newAlertId !== null && pendingAlerts.length > 0;

  function scrollToTop() {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    clearNew();
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <NewAlertBanner visible={showBanner} onPress={scrollToTop} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alertas Ativos</Text>
          <Text style={styles.subtitle}>
            {pendingAlerts.length === 0
              ? 'Nenhum alerta pendente'
              : `${pendingAlerts.length} aguardando resposta`}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.pill, pendingAlerts.some(a => a.severity === 'critical') && styles.pillCritical]}>
            <Text style={styles.pillText}>{pendingAlerts.length}</Text>
          </View>
        </View>
      </View>

      {pendingAlerts.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="shield" size={48} color={Colors.primary} />
          <Text style={styles.emptyTitle}>Pátio seguro</Text>
          <Text style={styles.emptyText}>Nenhum alerta pendente no momento</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={pendingAlerts}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <AlertCard
              alert={item}
              index={index}
              onPress={() => router.push({ pathname: '/alerta/[id]', params: { id: item.id } })}
            />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 90 }]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={pendingAlerts.length > 0}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  banner: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.critical + '50',
  },
  bannerDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.critical,
  },
  bannerText: { flex: 1, color: Colors.text, fontSize: 13, fontWeight: '600' as const },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 24, fontWeight: '800' as const, color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  pill: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.primary + '50',
  },
  pillCritical: { backgroundColor: Colors.criticalSoft, borderColor: Colors.critical + '50' },
  pillText: { fontSize: 16, fontWeight: '800' as const, color: Colors.primary },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700' as const, color: Colors.text },
  emptyText: { fontSize: 14, color: Colors.textMuted },
});
