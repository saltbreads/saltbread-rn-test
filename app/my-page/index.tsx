// app/my-page/index.tsx
import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { fetchMyFavorites, FavoriteShop } from '@/api/users';

export default function MyPageScreen() {
  const { user, accessToken, isLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteShop[]>([]);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    setFavLoading(true);
    fetchMyFavorites(accessToken).then((data) => {
      setFavorites(data);
      setFavLoading(false);
    });
  }, [accessToken]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C8A97E" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>로그인이 필요합니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 프로필 영역 */}
      <View style={styles.profileSection}>
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

      {/* 찜 카운트 */}
      <View style={styles.statRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{favorites.length}</Text>
          <Text style={styles.statLabel}>찜한 가게</Text>
        </View>
      </View>

      {/* 찜한 가게 목록 */}
      <Text style={styles.sectionTitle}>찜한 가게</Text>
      {favLoading ? (
        <ActivityIndicator style={{ marginTop: 16 }} color="#C8A97E" />
      ) : favorites.length === 0 ? (
        <Text style={styles.emptyText}>아직 찜한 가게가 없어요.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.shopId}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              {item.heroImageUrl ? (
                <Image source={{ uri: item.heroImageUrl }} style={styles.shopImage} />
              ) : (
                <View style={[styles.shopImage, styles.shopImageFallback]} />
              )}
              <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{item.name}</Text>
                <Text style={styles.shopRegion}>{item.region}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  profileSection: { alignItems: 'center', paddingTop: 48, paddingBottom: 24, gap: 6 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  avatarFallback: { backgroundColor: '#C8A97E', alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 13, color: '#888' },
  provider: { fontSize: 12, color: '#aaa' },
  statRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  statBox: { alignItems: 'center', paddingHorizontal: 32 },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#FF8C00' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  favoriteItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 14 },
  shopImage: { width: 56, height: 56, borderRadius: 10 },
  shopImageFallback: { backgroundColor: '#f0f0f0' },
  shopInfo: { flex: 1 },
  shopName: { fontSize: 15, fontWeight: '600' },
  shopRegion: { fontSize: 13, color: '#888', marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 16, fontSize: 14 },
});
