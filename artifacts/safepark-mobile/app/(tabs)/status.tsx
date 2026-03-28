import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAlerts } from '@/context/AlertsContext';

const CAMERAS = [
  { name: 'ENTRADA PRINCIPAL 01', zone: 'Entrada', fps: 24, online: true },
  { name: 'RAMPA NORTE 02', zone: 'Rampa Norte', fps: 24, online: true },
  { name: 'PÁTIO COBERTO 03', zone: 'Pátio Coberto', fps: 24, online: true },
  { name: 'DEMO WHATSAPP 01', zone: 'Overview', fps: 24, online: true },
  { name: 'SAÍDA SUL 04', zone: 'Saída Sul', fps: 24, online: true },
  { name: 'CORREDOR LESTE 01', zone: 'Corredor Leste', fps: 24, online: true },
  { name: 'SUBSOLO B1', zone: 'Subsolo', fps: 0, online: false },
  { name: 'RAMPA SUL 03', zone: 'Rampa Sul', fps: 0, online: false },
];

function formatSeconds(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}

export default function StatusScreen() {
  const insets = useSafeAreaInsets();
  const { stats, alerts } = useAlerts();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const onlineCameras = CAMERAS.filter(c => c.online).length;
  const totalCameras = CAMERAS.length;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={{ paddingBottom: bottomPad + 90 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Status</Text>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Ao vivo</Text>
        </View>
      </View>

      {/* Operator Info */}
      <Animated.View entering={FadeInDown.delay(60)} style={styles.operatorCard}>
        <View style={styles.avatar}>
          <Feather name="user" size={22} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.operatorName}>Carlos Mendes</Text>
          <Text style={styles.operatorRole}>Operador Sênior · Safe Park Centro</Text>
        </View>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      </Animated.View>

      {/* Main Stats */}
      <Animated.View entering={FadeInDown.delay(120)} style={styles.statsGrid}>
        {[
          { label: 'Câmeras Online', value: `${onlineCameras}/${totalCameras}`, icon: 'video', color: Colors.success },
          { label: 'Alertas Críticos', value: stats.criticalToday, icon: 'alert-circle', color: Colors.critical },
          { label: 'Confirmados', value: stats.confirmedToday, icon: 'check-circle', color: Colors.primary },
          { label: 'Tempo Resp. Médio', value: formatSeconds(stats.avgResponseSeconds), icon: 'clock', color: Colors.medium },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Feather name={s.icon as any} size={18} color={s.color} />
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Today's activity */}
      <Animated.View entering={FadeInDown.delay(180)} style={styles.section}>
        <Text style={styles.sectionTitle}>Atividade hoje</Text>
        <View style={styles.activityBar}>
          {[...Array(24)].map((_, h) => {
            const count = alerts.filter(a => new Date(a.timestamp).getHours() === h).length;
            const height = Math.min(40, count * 12 + (count > 0 ? 6 : 2));
            return (
              <View key={h} style={styles.barCol}>
                <View style={[styles.bar, { height, backgroundColor: count > 0 ? Colors.primary : Colors.borderLight }]} />
                {h % 6 === 0 && <Text style={styles.barLabel}>{h}h</Text>}
              </View>
            );
          })}
        </View>
      </Animated.View>

      {/* Cameras list */}
      <Animated.View entering={FadeInDown.delay(240)} style={styles.section}>
        <Text style={styles.sectionTitle}>Câmeras ({onlineCameras}/{totalCameras} online)</Text>
        <View style={styles.cameraList}>
          {CAMERAS.map((cam, i) => (
            <View key={i} style={styles.cameraRow}>
              <View style={[styles.camDot, { backgroundColor: cam.online ? Colors.success : Colors.border }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.camName, !cam.online && { color: Colors.textMuted }]}>{cam.name}</Text>
                <Text style={styles.camZone}>{cam.zone}</Text>
              </View>
              {cam.online ? (
                <Text style={styles.camFps}>{cam.fps} FPS</Text>
              ) : (
                <Text style={styles.camOffline}>Offline</Text>
              )}
            </View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  title: { fontSize: 24, fontWeight: '800' as const, color: Colors.text },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.surfaceHigh, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
  liveText: { fontSize: 12, color: Colors.success, fontWeight: '600' as const },
  operatorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginHorizontal: 16, marginBottom: 14,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primarySoft, borderWidth: 1, borderColor: Colors.primary + '40',
    alignItems: 'center', justifyContent: 'center',
  },
  operatorName: { fontSize: 15, fontWeight: '700' as const, color: Colors.text },
  operatorRole: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.successSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  onlineText: { fontSize: 11, color: Colors.success, fontWeight: '600' as const },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 16 },
  statCard: {
    width: '47%', backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
    alignItems: 'flex-start', gap: 6, borderWidth: 1, borderColor: Colors.borderLight,
    marginLeft: 4,
  },
  statValue: { fontSize: 22, fontWeight: '800' as const },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' as const },
  section: { marginHorizontal: 16, marginBottom: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.borderLight },
  sectionTitle: { fontSize: 13, fontWeight: '700' as const, color: Colors.text, marginBottom: 14 },
  activityBar: { flexDirection: 'row', alignItems: 'flex-end', height: 52, gap: 2 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 2, minHeight: 2 },
  barLabel: { fontSize: 8, color: Colors.textMuted, marginTop: 3 },
  cameraList: { gap: 10 },
  cameraRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  camDot: { width: 8, height: 8, borderRadius: 4 },
  camName: { fontSize: 13, fontWeight: '600' as const, color: Colors.text },
  camZone: { fontSize: 11, color: Colors.textMuted },
  camFps: { fontSize: 11, color: Colors.success, fontWeight: '700' as const },
  camOffline: { fontSize: 11, color: Colors.textMuted },
});
