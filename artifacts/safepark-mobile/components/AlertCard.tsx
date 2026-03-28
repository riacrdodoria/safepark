import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import type { ParkingAlert } from '@/constants/mockAlerts';

const ALERT_IMAGES = [
  require('@/assets/images/alert1.png'),
  require('@/assets/images/alert2.png'),
  require('@/assets/images/alert3.png'),
  require('@/assets/images/alert4.png'),
];

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

function severityConfig(severity: ParkingAlert['severity']) {
  switch (severity) {
    case 'critical': return { color: Colors.critical, bg: Colors.criticalSoft, label: 'CRÍTICO', icon: 'alert-circle' as const };
    case 'high': return { color: Colors.high, bg: Colors.highSoft, label: 'ALTO', icon: 'alert-triangle' as const };
    case 'medium': return { color: Colors.medium, bg: Colors.mediumSoft, label: 'MÉDIO', icon: 'info' as const };
  }
}

interface Props {
  alert: ParkingAlert;
  onPress: () => void;
  index?: number;
}

export default function AlertCard({ alert, onPress, index = 0 }: Props) {
  const sev = severityConfig(alert.severity);
  const isResolved = alert.status !== 'pending';

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed, isResolved && styles.cardResolved]}
        onPress={onPress}
        testID={`alert-card-${alert.id}`}
      >
        {/* Left border accent */}
        <View style={[styles.borderAccent, { backgroundColor: isResolved ? Colors.border : sev.color }]} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.badge, { backgroundColor: isResolved ? Colors.surfaceHigh : sev.bg }]}>
              <Feather name={isResolved ? 'check-circle' : sev.icon} size={11} color={isResolved ? Colors.textMuted : sev.color} />
              <Text style={[styles.badgeText, { color: isResolved ? Colors.textMuted : sev.color }]}>
                {isResolved ? (alert.status === 'confirmed' ? 'CONFIRMADO' : 'FALSO ALARME') : sev.label}
              </Text>
            </View>
            <Text style={styles.time}>{timeAgo(alert.timestamp)}</Text>
          </View>

          <Text style={[styles.title, isResolved && styles.titleMuted]} numberOfLines={1}>
            {alert.title}
          </Text>
          <Text style={styles.camera} numberOfLines={1}>
            <Feather name="video" size={11} color={Colors.textMuted} /> {alert.camera}
          </Text>

          <View style={styles.imageRow}>
            <Image
              source={ALERT_IMAGES[alert.imageAsset % ALERT_IMAGES.length]}
              style={[styles.thumb, isResolved && styles.thumbMuted]}
              resizeMode="cover"
            />
            <Text style={styles.desc} numberOfLines={2}>{alert.description}</Text>
          </View>

          {!isResolved && (
            <View style={styles.actionHint}>
              <Text style={styles.actionHintText}>Toque para responder</Text>
              <Feather name="chevron-right" size={14} color={Colors.primary} />
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardPressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  cardResolved: { opacity: 0.55 },
  borderAccent: { width: 4, borderRadius: 0 },
  content: { flex: 1, padding: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 0.5 },
  time: { fontSize: 11, color: Colors.textMuted },
  title: { fontSize: 15, fontWeight: '700' as const, color: Colors.text, marginBottom: 3 },
  titleMuted: { color: Colors.textSecondary },
  camera: { fontSize: 11, color: Colors.textMuted, marginBottom: 10 },
  imageRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  thumb: { width: 72, height: 52, borderRadius: 8, backgroundColor: Colors.surfaceHigh },
  thumbMuted: { opacity: 0.5 },
  desc: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  actionHint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10, gap: 4 },
  actionHintText: { fontSize: 11, color: Colors.primary, fontWeight: '600' as const },
});
