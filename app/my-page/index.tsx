// app/my-page/index.tsx
import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { fetchMyFavorites, fetchMyReviews, FavoriteShop, MyReview } from '@/api/users';

export default function MyPageScreen() {
  const { user, isLoggedIn, isLoading, authFetch } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteShop[]>([]);
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    setDataLoading(true);
    Promise.all([
      fetchMyFavorites(authFetch),
      fetchMyReviews(authFetch),
    ]).then(([favData, reviewData]) => {
      setFavorites(favData);
      setReviews(reviewData?.items ?? []);
      setDataLoading(false);
    });
  }, [isLoggedIn, authFetch]);

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

      {/* 통계 */}
      <View style={styles.statRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{favorites.length}</Text>
          <Text style={styles.statLabel}>찜한 가게</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <View style={styles.reviewStatRow}>
            <Text style={styles.statNumber}>{reviews.length}</Text>
            {user.avgRating != null && (
              <Text style={styles.avgRating}>( ⭐{user.avgRating.toFixed(1)} )</Text>
            )}
          </View>
          <Text style={styles.statLabel}>작성한 리뷰</Text>
        </View>
      </View>

      {dataLoading ? (
        <ActivityIndicator style={{ marginTop: 32 }} color="#C8A97E" />
      ) : (
        <>
          {/* 찜한 가게 */}
          <Text style={styles.sectionTitle}>찜한 가게</Text>
          {favorites.length === 0 ? (
            <Text style={styles.emptyText}>아직 찜한 가게가 없어요.</Text>
          ) : (
            favorites.map((item) => (
              <View key={item.shopId} style={styles.favoriteItem}>
                {item.heroImageUrl ? (
                  <Image source={{ uri: item.heroImageUrl }} style={styles.shopImage} />
                ) : (
                  <View style={[styles.shopImage, styles.shopImageFallback]} />
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSub}>{item.region}</Text>
                </View>
              </View>
            ))
          )}

          {/* 내 리뷰 */}
          <Text style={styles.sectionTitle}>작성한 리뷰</Text>
          {reviews.length === 0 ? (
            <Text style={styles.emptyText}>아직 작성한 리뷰가 없어요.</Text>
          ) : (
            reviews.map((item) => (
              <View key={item.id} style={styles.reviewItem}>
                {item.shop.heroImageUrl ? (
                  <Image source={{ uri: item.shop.heroImageUrl }} style={styles.shopImage} />
                ) : (
                  <View style={[styles.shopImage, styles.shopImageFallback]} />
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.shop.name}</Text>
                  <View style={styles.ratingRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < item.rating ? 'star' : 'star-outline'}
                        size={12}
                        color="#FF8C00"
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewContent} numberOfLines={2}>{item.content}</Text>
                  {item.tags.length > 0 && (
                    <View style={styles.tagRow}>
                      {item.tags.map((tag) => (
                        <View key={tag} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
          <View style={{ height: 32 }} />
        </>
      )}
    </ScrollView>
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
  statRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  statBox: { alignItems: 'center', paddingHorizontal: 40 },
  statDivider: { width: 1, height: 32, backgroundColor: '#f0f0f0' },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#FF8C00' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  reviewStatRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  avgRating: { fontSize: 22, color: '#FF8C00', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 10 },
  favoriteItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 14 },
  reviewItem: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 12, gap: 14 },
  shopImage: { width: 56, height: 56, borderRadius: 10 },
  shopImageFallback: { backgroundColor: '#f0f0f0' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600' },
  itemSub: { fontSize: 13, color: '#888', marginTop: 2 },
  ratingRow: { flexDirection: 'row', gap: 2, marginTop: 3 },
  reviewContent: { fontSize: 13, color: '#555', marginTop: 4, lineHeight: 18 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tag: { backgroundColor: '#FFF4E5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tagText: { fontSize: 11, color: '#FF8C00' },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 8, fontSize: 14, paddingHorizontal: 20 },
});
