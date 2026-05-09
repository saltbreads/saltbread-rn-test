// app/my-page/review/index.tsx
import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReviewStore } from '@/store/useReviewStore';
import { useAuth } from '@/context/AuthContext';
import { fetchMyReviews, MyReview } from '@/api/users';
import { REVIEW_TAG_EMOJI } from '@/constants/reviewTags';
import { AppColors } from '@/constants/theme';

export default function ReviewDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { authFetch } = useAuth();
  const { selectedReviewId, clear } = useReviewStore();
  const listRef = useRef<FlatList<MyReview>>(null);

  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const scrolledRef = useRef(false);

  // 전체 리뷰 한 번에 로드 (플래시 없이 선택 위치로 바로 이동)
  useEffect(() => {
    fetchMyReviews(authFetch, { page: 1, limit: 100 }).then((data) => {
      setReviews(data?.items ?? []);
      setLoading(false);
    });
  }, []);

  // FlatList 렌더 완료 후 선택한 리뷰로 스크롤
  useEffect(() => {
    if (loading || scrolledRef.current || !selectedReviewId) return;
    const idx = reviews.findIndex((r) => r.id === selectedReviewId);
    if (idx <= 0) {
      scrolledRef.current = true;
      setVisible(true);
      return;
    }
    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: idx, animated: false });
      scrolledRef.current = true;
      setTimeout(() => setVisible(true), 50); // 스크롤 적용 후 표시
    }, 200);
  }, [loading, reviews]);

  const renderItem = ({ item }: { item: MyReview }) => (
    <View style={styles.card}>
      <View style={styles.shopRow}>
        {item.shop.heroImageUrl
          ? <Image source={{ uri: item.shop.heroImageUrl }} style={styles.shopThumb} />
          : <View style={[styles.shopThumb, styles.shopThumbFallback]} />
        }
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{item.shop.name}</Text>
          <Text style={styles.shopAddress} numberOfLines={1}>{item.shop.roadAddress}</Text>
        </View>
      </View>

      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons key={i} name={i < item.rating ? 'star' : 'star-outline'} size={16} color={AppColors.primary} />
        ))}
        <Text style={styles.ratingText}>{item.rating}.0</Text>
      </View>

      <Text style={styles.content}>{item.content}</Text>

      {item.tags.length > 0 && (
        <View style={styles.tagRow}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{REVIEW_TAG_EMOJI[tag] ?? '🏷️'} {tag}</Text>
            </View>
          ))}
        </View>
      )}

      {item.images.length > 0 && (
        <View style={styles.imageRow}>
          {item.images.map((img) => (
            <Image key={img.id} source={{ uri: img.url }} style={styles.reviewImage} />
          ))}
        </View>
      )}

      <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { clear(); router.back(); }}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내가 쓴 리뷰</Text>
        <View style={{ width: 26 }} />
      </View>

      {(loading || !visible) && (
        <ActivityIndicator style={[StyleSheet.absoluteFillObject, { backgroundColor: '#fff', zIndex: 1 }]} color={AppColors.primary} />
      )}
      {!loading && (
        <FlatList
          style={{ flex: 1, opacity: visible ? 1 : 0 }}
          ref={listRef}
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              listRef.current?.scrollToIndex({ index: info.index, animated: false });
            }, 300);
          }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  headerTitle: { fontSize: 17, fontWeight: 'bold' },

  card: { paddingHorizontal: 20, paddingVertical: 16 },
  shopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  shopThumb: { width: 44, height: 44, borderRadius: 8 },
  shopThumbFallback: { backgroundColor: '#f0f0f0' },
  shopInfo: { flex: 1 },
  shopName: { fontSize: 15, fontWeight: '700' },
  shopAddress: { fontSize: 12, color: '#888', marginTop: 2 },

  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 8 },
  ratingText: { fontSize: 13, color: AppColors.primary, fontWeight: '600', marginLeft: 4 },

  content: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 10 },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  tag: { backgroundColor: AppColors.primaryBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 12, color: AppColors.primary },

  imageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  reviewImage: { width: 90, height: 90, borderRadius: 8 },

  date: { fontSize: 12, color: '#bbb' },
  separator: { height: 1, backgroundColor: '#f0f0f0' },
});
