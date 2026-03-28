import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlertCard from '@/components/AlertCard';
import Colors from '@/constants/colors';
import { useAlerts } from '@/context/AlertsContext';

export default function HistoricoScreen() {
  const insets = useSafeAreaInsets();
  const { resolvedAlerts } = useAlerts();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const confirmed = resolvedAlerts.filter(a => a.status === 'confirmed').length;
  const dismissed = resolvedAlerts.filter(a => a.status === 'dismissed').length;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>{resolvedAlerts.length} alertas resolvidos hoje</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: Colors.success + '40' }]}>
          <Feather name="check-circle" size={18} color={Colors.success} />
          <Text style={[styles.statValue, { color: Colors.success }]}>{confirmed}</Text>
          <Text style={styles.statLabel}>Confirmados</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.border }]}>
          <Feather name="x-circle" size={18} color={Colors.textMuted} />
          <Text style={[styles.statValue, { color: Colors.textMuted }]}>{dismissed}</Text>
          <Text style={styles.statLabel}>Falso Alarme</Text>
        </View>
      </View>

      {resolvedAlerts.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="clock" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>Nenhum alerta resolvido ainda</Text>
        </View>
      ) : (
        <FlatList
          data={resolvedAlerts}
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
          scrollEnabled={resolvedAlerts.length > 0}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 24, fontWeight: '800' as const, color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  statCard: {
    flex: 1, backgroundColor: Colors.surface,
    borderRadius: 12, padding: 14,
    alignItems: 'center', gap: 4,
    borderWidth: 1,
  },
  statValue: { fontSize: 22, fontWeight: '800' as const },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' as const },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
});
