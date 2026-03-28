import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAlerts } from '@/context/AlertsContext';

const ALERT_IMAGES = [
  require('@/assets/images/alert1.png'),
  require('@/assets/images/alert2.png'),
  require('@/assets/images/alert3.png'),
  require('@/assets/images/alert4.png'),
];

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDate(date: Date) {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function severityStyle(severity: string) {
  switch (severity) {
    case 'critical': return { color: Colors.critical, bg: Colors.criticalSoft, label: 'CRÍTICO' };
    case 'high': return { color: Colors.high, bg: Colors.highSoft, label: 'ALTO' };
    default: return { color: Colors.medium, bg: Colors.mediumSoft, label: 'MÉDIO' };
  }
}

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { alerts, confirmAlert, dismissAlert } = useAlerts();
  const insets = useSafeAreaInsets();
  const [confirming, setConfirming] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const alert = alerts.find(a => a.id === id);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  if (!alert) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <Text style={{ color: Colors.text, textAlign: 'center', marginTop: 40 }}>Alerta não encontrado.</Text>
      </View>
    );
  }

  const sev = severityStyle(alert.severity);
  const isResolved = alert.status !== 'pending';

  async function handleConfirm() {
    if (isResolved) return;
    setConfirming(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    confirmAlert(alert!.id);
    setTimeout(() => router.back(), 500);
  }

  async function handleDismiss() {
    if (isResolved) return;
    setDismissing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dismissAlert(alert!.id);
    setTimeout(() => router.back(), 500);
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Back button */}
      <View style={styles.navBar}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
          testID="back-button"
        >
          <Feather name="chevron-left" size={22} color={Colors.text} />
          <Text style={styles.backText}>Alertas</Text>
        </Pressable>
        <View style={[styles.severityBadge, { backgroundColor: sev.bg }]}>
          <Text style={[styles.severityText, { color: sev.color }]}>{sev.label}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Camera image */}
        <Animated.View entering={FadeIn} style={styles.imageContainer}>
          <Image
            source={ALERT_IMAGES[alert.imageAsset % ALERT_IMAGES.length]}
            style={styles.cameraImage}
            resizeMode="cover"
          />
          {/* Overlay info */}
          <View style={styles.imageOverlay}>
            <View style={styles.recBadge}>
              <View style={styles.recDot} />
              <Text style={styles.recText}>REC  24 FPS</Text>
            </View>
            <View style={styles.cameraLabel}>
              <Feather name="video" size={12} color={Colors.text} />
              <Text style={styles.cameraLabelText}>{alert.camera}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.body}>
          {/* Title */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <View style={styles.metaRow}>
              <Feather name="map-pin" size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{alert.zone}</Text>
            </View>
            <View style={styles.metaRow}>
              <Feather name="clock" size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{formatTime(alert.timestamp)} · {formatDate(alert.timestamp)}</Text>
            </View>
            {alert.plate && (
              <View style={styles.plateContainer}>
                <Feather name="truck" size={12} color={Colors.primary} />
                <Text style={styles.plateText}>{alert.plate}</Text>
              </View>
            )}
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(180)} style={styles.descCard}>
            <Text style={styles.descLabel}>Descrição do evento</Text>
            <Text style={styles.descText}>{alert.description}</Text>
          </Animated.View>

          {/* AI Confidence */}
          <Animated.View entering={FadeInDown.delay(240)} style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Feather name="cpu" size={14} color={Colors.primary} />
              <Text style={styles.aiLabel}>Análise por IA</Text>
            </View>
            <View style={styles.aiRows}>
              {[
                { label: 'Detecção de pessoa', value: '0.94' },
                { label: 'Comportamento anômalo', value: '0.87' },
                { label: 'Risco operacional', value: alert.severity === 'critical' ? '0.91' : alert.severity === 'high' ? '0.76' : '0.62' },
              ].map((row, i) => (
                <View key={i} style={styles.aiRow}>
                  <Text style={styles.aiRowLabel}>{row.label}</Text>
                  <View style={styles.aiBarBg}>
                    <View style={[styles.aiBarFill, { width: `${parseFloat(row.value) * 100}%` as any, backgroundColor: sev.color }]} />
                  </View>
                  <Text style={[styles.aiConfidence, { color: sev.color }]}>{row.value}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Resolution info if resolved */}
          {isResolved && alert.respondedAt && (
            <Animated.View entering={FadeInDown.delay(300)} style={styles.resolvedCard}>
              <Feather
                name={alert.status === 'confirmed' ? 'check-circle' : 'x-circle'}
                size={20}
                color={alert.status === 'confirmed' ? Colors.success : Colors.textMuted}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.resolvedTitle}>
                  {alert.status === 'confirmed' ? 'Ocorrência confirmada' : 'Falso alarme'}
                </Text>
                <Text style={styles.resolvedMeta}>
                  {alert.respondedBy} · {formatTime(alert.respondedAt)}
                </Text>
              </View>
            </Animated.View>
          )}

          <View style={{ height: bottomPad + 120 }} />
        </View>
      </ScrollView>

      {/* Action buttons */}
      {!isResolved && (
        <Animated.View
          entering={FadeInDown.delay(320)}
          style={[styles.actionBar, { paddingBottom: bottomPad + 16 }]}
        >
          <Pressable
            style={({ pressed }) => [styles.btnDismiss, (pressed || dismissing) && { opacity: 0.8 }]}
            onPress={handleDismiss}
            disabled={dismissing || confirming}
            testID="dismiss-button"
          >
            <Feather name="x-circle" size={18} color={Colors.textSecondary} />
            <Text style={styles.btnDismissText}>Falso Alarme</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.btnConfirm, (pressed || confirming) && { opacity: 0.85 }]}
            onPress={handleConfirm}
            disabled={dismissing || confirming}
            testID="confirm-button"
          >
            <Feather name="alert-triangle" size={18} color="#000" />
            <Text style={styles.btnConfirmText}>Confirmar Ocorrência</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8, paddingRight: 12 },
  backText: { fontSize: 16, color: Colors.text, fontWeight: '500' as const },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  severityText: { fontSize: 11, fontWeight: '800' as const, letterSpacing: 1 },
  imageContainer: { width: '100%', height: 240, position: 'relative' },
  cameraImage: { width: '100%', height: '100%' },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 12,
  },
  recBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 6, alignSelf: 'flex-start',
  },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.critical },
  recText: { color: '#fff', fontSize: 10, fontWeight: '700' as const },
  cameraLabel: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  cameraLabelText: { color: '#fff', fontSize: 11, fontWeight: '600' as const },
  body: { padding: 20 },
  alertTitle: { fontSize: 22, fontWeight: '800' as const, color: Colors.text, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  metaText: { fontSize: 12, color: Colors.textMuted },
  plateContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primarySoft, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8, alignSelf: 'flex-start', marginTop: 6, borderWidth: 1, borderColor: Colors.primary + '40',
  },
  plateText: { fontSize: 13, fontWeight: '700' as const, color: Colors.primary },
  descCard: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
    marginTop: 16, borderWidth: 1, borderColor: Colors.borderLight,
  },
  descLabel: { fontSize: 11, fontWeight: '700' as const, color: Colors.textMuted, marginBottom: 8, letterSpacing: 0.5 },
  descText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
  aiCard: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
    marginTop: 12, borderWidth: 1, borderColor: Colors.borderLight,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  aiLabel: { fontSize: 13, fontWeight: '700' as const, color: Colors.text },
  aiRows: { gap: 10 },
  aiRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiRowLabel: { fontSize: 12, color: Colors.textSecondary, width: 160 },
  aiBarBg: { flex: 1, height: 5, backgroundColor: Colors.surfaceHigh, borderRadius: 3, overflow: 'hidden' },
  aiBarFill: { height: '100%', borderRadius: 3 },
  aiConfidence: { fontSize: 12, fontWeight: '700' as const, width: 32, textAlign: 'right' },
  resolvedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 14, padding: 14,
    marginTop: 12, borderWidth: 1, borderColor: Colors.borderLight,
  },
  resolvedTitle: { fontSize: 14, fontWeight: '600' as const, color: Colors.text },
  resolvedMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10,
    backgroundColor: Colors.background + 'f0',
    paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  btnDismiss: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.surfaceHigh, borderRadius: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  btnDismissText: { fontSize: 14, fontWeight: '700' as const, color: Colors.textSecondary },
  btnConfirm: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14,
  },
  btnConfirmText: { fontSize: 14, fontWeight: '800' as const, color: '#000' },
});
