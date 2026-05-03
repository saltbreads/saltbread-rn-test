// app/my-page/index.tsx
import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { fetchMyFavorites, fetchMyReviews, FavoriteShop, MyReview } from '@/api/users';
import { REVIEW_TAG_EMOJI } from '@/constants/reviewTags';
import { useMapStore } from '@/store/useMapStore';

type TabType = 'favorites' | 'reviews';

export default function MyPageScreen() {
  const { user, isLoggedIn, isLoading, authFetch } = useAuth();
  const router = useRouter();
  const { setPendingShopId } = useMapStore();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('favorites');
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
        <ActivityIndicator size="large" color="#FF8C00" />
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

  const ProfileHeader = () => (
    <>
      {/* 프로필 */}
      <View style={[styles.profileSection, { paddingTop: insets.top + 16 }]}>
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

      {/* 탭 */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('favorites')}>
          <Text style={[styles.tabCount, activeTab === 'favorites' && styles.tabCountActive]}>
            {favorites.length}
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'favorites' && styles.tabLabelActive]}>
            찜한 가게
          </Text>
          {activeTab === 'favorites' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <View style={styles.tabDivider} />

        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('reviews')}>
          <View style={styles.reviewStatRow}>
            <Text style={[styles.tabCount, activeTab === 'reviews' && styles.tabCountActive]}>
              {reviews.length}
            </Text>
            {user.avgRating != null && (
              <Text style={[styles.avgRating, activeTab === 'reviews' && styles.tabCountActive]}>
                ( ⭐{user.avgRating.toFixed(1)} )
              </Text>
            )}
          </View>
          <Text style={[styles.tabLabel, activeTab === 'reviews' && styles.tabLabelActive]}>
            작성한 리뷰
          </Text>
          {activeTab === 'reviews' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>
    </>
  );

  if (dataLoading) {
    return (
      <View style={styles.container}>
        <ProfileHeader />
        <ActivityIndicator style={{ marginTop: 48 }} color="#FF8C00" />
      </View>
    );
  }

  if (activeTab === 'favorites') {
    return (
      <View style={styles.container}>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.shopId}
          ListHeaderComponent={<ProfileHeader />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                setPendingShopId(item.shopId);
                router.push('/(tabs)/my-map');
              }}
            >
              {item.heroImageUrl
                ? <Image source={{ uri: item.heroImageUrl }} style={styles.shopImage} />
                : <View style={[styles.shopImage, styles.shopImageFallback]} />
              }
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.shopStats}>
                  {'💬'} {item.reviewCount}{item.avgRating != null ? `  ⭐${item.avgRating.toFixed(1)}` : ''}
                </Text>
                {item.roadAddress && (
                  <Text style={styles.itemSub} numberOfLines={1}>{item.roadAddress}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>아직 찜한 가게가 없어요.</Text>}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<ProfileHeader />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.shop.heroImageUrl
              ? <Image source={{ uri: item.shop.heroImageUrl }} style={styles.shopImage} />
              : <View style={[styles.shopImage, styles.shopImageFallback]} />
            }
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.shop.name}</Text>
              <View style={styles.ratingRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons key={i} name={i < item.rating ? 'star' : 'star-outline'} size={12} color="#FF8C00" />
                ))}
              </View>
              <Text style={styles.reviewContent} numberOfLines={2}>{item.content}</Text>
              {item.tags.length > 0 && (
                <View style={styles.tagRow}>
                  {item.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{REVIEW_TAG_EMOJI[tag] ?? '🏷️'} {tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>아직 작성한 리뷰가 없어요.</Text>}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },

  profileSection: { alignItems: 'center', paddingBottom: 24, gap: 6 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  avatarFallback: { backgroundColor: '#FF8C00', alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 13, color: '#888' },
  provider: { fontSize: 12, color: '#aaa' },

  tabRow: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, position: 'relative' },
  tabCount: { fontSize: 22, fontWeight: 'bold', color: '#ccc' },
  tabCountActive: { color: '#FF8C00' },
  tabLabel: { fontSize: 12, color: '#bbb', marginTop: 2 },
  tabLabelActive: { color: '#333' },
  tabIndicator: { position: 'absolute', bottom: 0, width: '40%', height: 2, backgroundColor: '#FF8C00', borderRadius: 1 },
  tabDivider: { width: 1, height: 40, backgroundColor: '#f0f0f0', alignSelf: 'center' },
  reviewStatRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  avgRating: { fontSize: 14, color: '#ccc', fontWeight: '500' },

  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 14 },
  shopImage: { width: 56, height: 56, borderRadius: 10 },
  shopImageFallback: { backgroundColor: '#f0f0f0' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600' },
  shopStats: { fontSize: 13, color: '#888', marginTop: 2 },
  itemSub: { fontSize: 13, color: '#aaa', marginTop: 2 },
  ratingRow: { flexDirection: 'row', gap: 2, marginTop: 3 },
  reviewContent: { fontSize: 13, color: '#555', marginTop: 4, lineHeight: 18 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tag: { backgroundColor: '#FFF4E5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tagText: { fontSize: 11, color: '#FF8C00' },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 32, fontSize: 14 },
});
