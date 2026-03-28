import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Colors from "@/constants/colors";
import { useAlerts } from "@/context/AlertsContext";

function PendingDot() {
  const { pendingAlerts } = useAlerts();
  if (pendingAlerts.length === 0) return null;
  return (
    <View style={{
      position: 'absolute', top: -2, right: -6,
      width: 8, height: 8, borderRadius: 4,
      backgroundColor: pendingAlerts.some(a => a.severity === 'critical') ? Colors.critical : Colors.primary,
    }} />
  );
}

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "bell", selected: "bell.fill" }} />
        <Label>Alertas</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="historico">
        <Icon sf={{ default: "clock", selected: "clock.fill" }} />
        <Label>Histórico</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="status">
        <Icon sf={{ default: "shield", selected: "shield.fill" }} />
        <Label>Status</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.borderLight,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.surface }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Alertas",
          tabBarIcon: ({ color, focused }) => (
            <View>
              {isIOS
                ? <SymbolView name={focused ? "bell.fill" : "bell"} tintColor={color} size={24} />
                : <Feather name="bell" size={22} color={color} />
              }
              <PendingDot />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: "Histórico",
          tabBarIcon: ({ color, focused }) =>
            isIOS
              ? <SymbolView name={focused ? "clock.fill" : "clock"} tintColor={color} size={24} />
              : <Feather name="clock" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="status"
        options={{
          title: "Status",
          tabBarIcon: ({ color, focused }) =>
            isIOS
              ? <SymbolView name={focused ? "shield.fill" : "shield"} tintColor={color} size={24} />
              : <Feather name="shield" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) return <NativeTabLayout />;
  return <ClassicTabLayout />;
}
