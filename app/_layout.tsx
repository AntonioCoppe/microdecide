import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider } from "../lib/auth";
import { useAuth } from "../lib/auth";
import { useEffect } from "react";
import "../global.css";

function InnerLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // Only redirect if we're not already on onboarding
      if (segments[0] !== 'onboarding') {
        router.replace('/onboarding');
      }
    }
  }, [user, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ title: "Onboarding" }} />
      <Stack.Screen name="paywall" options={{ title: "Upgrade" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InnerLayout />
    </AuthProvider>
  );
}
