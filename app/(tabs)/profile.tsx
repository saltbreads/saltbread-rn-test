// app/(tabs)/profile.tsx (예시)
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '@/constants/routes';

export default function ProfileScreen() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>로그인이 필요합니다 🥐</Text>
        <Button title="로그인하러 가기" onPress={() => router.push(ROUTES.LOGIN)} />
      </View>
    );
  }

  const displayName = user?.nickname ?? user?.displayName ?? '소금빵 매니아';

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>환영합니다, {displayName}님!</Text>
      <Button title="로그아웃" onPress={logout} color="red" />
    </View>
  );
}