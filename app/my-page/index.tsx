// app/my-page/index.tsx
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function MyPageScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#C8A97E" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>로그인이 필요합니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user.profileImageUrl ? (
        <Image source={{ uri: user.profileImageUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarInitial}>
            {(user.nickname ?? user.displayName).charAt(0)}
          </Text>
        </View>
      )}
      <Text style={styles.name}>{user.nickname ?? user.displayName}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.provider}>{user.provider} 계정으로 로그인</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  avatarFallback: {
    backgroundColor: '#C8A97E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#888',
  },
  provider: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
