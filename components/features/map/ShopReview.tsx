// components/features/map/ShopReview.tsx
import { createShopReview, fetchAiTagSuggestions, likeReview, unlikeReview } from "@/api/review";
import ReviewCommentSection from "@/components/features/review/ReviewCommentSection";
import ReviewCommentModal from "@/components/features/review/ReviewCommentModal";
import ShopTagList from "./ShopTagList";
import { useAuth } from "@/context/AuthContext";
import { useShopReviews } from "@/hooks/shop/useShopReviews";
import { ShopReviewData } from "@/types/review";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomAlertModal, { CustomAlertType } from "../modal/CustomAlertModal";
import { AppColors } from '@/constants/theme';
import ReviewCreateModal, {
  CreateReviewPayload,
} from "../modal/ReviewCreateModal";

const ShopReview = ({ shopId }: { shopId: string }) => {
  const insets = useSafeAreaInsets();
  const { accessToken } = useAuth();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [commentModalReview, setCommentModalReview] = useState<{ id: string; count: number } | null>(null);

  const [alertState, setAlertState] = useState<{
    open: boolean;
    type: CustomAlertType;
    title: string;
    message: string;
  }>({
    open: false,
    type: "info",
    title: "",
    message: "",
  });

  const { reviews, setReviews, isLoading, getReviews } = useShopReviews(shopId, accessToken);

  useEffect(() => {
    getReviews();
  }, [getReviews]);

  const showAlert = ({
    type = "info",
    title,
    message,
  }: {
    type?: CustomAlertType;
    title: string;
    message: string;
  }) => {
    setAlertState({
      open: true,
      type,
      title,
      message,
    });
  };

  const closeAlert = () => {
    setAlertState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleOpenReviewModal = () => {
    if (!accessToken) {
      showAlert({
        type: "warning",
        title: "로그인이 필요해요",
        message: "리뷰를 작성하려면 먼저 로그인해주세요.",
      });
      return;
    }

    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleSubmitReview = async (payload: CreateReviewPayload) => {
    if (!accessToken) {
      showAlert({
        type: "warning",
        title: "로그인이 필요해요",
        message: "리뷰를 작성하려면 먼저 로그인해주세요.",
      });
      return;
    }

    try {
      setIsSubmittingReview(true);

      const createdReview = await createShopReview({
        shopId,
        ...payload,
        accessToken,
      });

      if (!createdReview) {
        throw new Error("리뷰 등록 응답이 비어있습니다.");
      }

      await getReviews();

      showAlert({
        type: "success",
        title: "리뷰 등록 완료",
        message: "리뷰가 등록되었어요.",
      });
    } catch (error) {
      console.error("Failed to submit review:", error);

      showAlert({
        type: "error",
        title: "리뷰 등록 실패",
        message: "리뷰 등록 중 문제가 발생했어요.",
      });

      throw error;
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAiTagSuggestion = async (content: string) => {
    if (!accessToken) {
      showAlert({
        type: "warning",
        title: "로그인이 필요해요",
        message: "AI 태그 추천을 사용하려면 먼저 로그인해주세요.",
      });
      return [];
    }

    const result = await fetchAiTagSuggestions({
      content,
      accessToken,
    });

    return result.items;
  };

  const handleLike = async (review: ShopReviewData) => {
    if (!accessToken) return;
    const liked = review.isLikedByMe;
    // 낙관적 업데이트
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id
          ? { ...r, isLikedByMe: !liked, likeCount: liked ? r.likeCount - 1 : r.likeCount + 1 }
          : r
      )
    );
    const ok = liked
      ? await unlikeReview(review.id, accessToken)
      : await likeReview(review.id, accessToken);
    if (!ok) {
      // 실패 시 롤백
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id
            ? { ...r, isLikedByMe: liked, likeCount: review.likeCount }
            : r
        )
      );
    }
  };

  const renderReviewItem = ({ item }: { item: ShopReviewData }) => (
    <View style={styles.reviewCard}>
      {/* 유저 정보 영역 */}
      <View style={styles.authorSection}>
        <Image
          source={{ uri: item.author?.profileImageUrl || "기본이미지URL" }}
          style={styles.profilePic}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.nickname}>
            {item.author?.nickname ?? item.author?.displayName ?? "익명 사용자"}
          </Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
        </View>
      </View>

      {/* 리뷰 본문 */}
      <Text style={styles.content}>{item.content}</Text>

      {/* 리뷰 이미지들 (최대 3개, 초과 시 +N 오버레이) */}
      {item.images?.length > 0 && (
        <View style={styles.imageRow}>
          {item.images.slice(0, 3).map((img, idx) => {
            const isLast = idx === 2;
            const remaining = item.images.length - 3;
            return (
              <View key={img.id} style={styles.imageWrapper}>
                <Image
                  source={{ uri: img.url }}
                  style={styles.reviewImage}
                  contentFit="cover"
                />
                {isLast && remaining > 0 && (
                  <View style={styles.imageOverlay}>
                    <Text style={styles.imageOverlayText}>+{remaining}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* 좋아요 + 댓글 */}
      <ReviewCommentSection
        likeCount={item.likeCount ?? 0}
        commentCount={item.commentCount ?? 0}
        isLikedByMe={item.isLikedByMe ?? false}
        comments={item.comments ?? []}
        mode="preview"
        onLikePress={() => handleLike(item)}
        onCommentPress={() => setCommentModalReview({ id: item.id, count: item.commentCount ?? 0 })}
      />
    </View>
  );

  return (
    <>
      <FlatList<ShopReviewData>
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        ListHeaderComponent={
          isLoading ? (
            <ActivityIndicator style={{ padding: 40 }} color={AppColors.primary} />
          ) : (
            <View>
              <ShopTagList shopId={shopId} mode="expandable" />
              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>리뷰 {reviews.length}개</Text>
                <TouchableOpacity
                  style={styles.writeButton}
                  onPress={handleOpenReviewModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.writeButtonText}>+ 리뷰 작성하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
        ListEmptyComponent={!isLoading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 작성된 리뷰가 없어요. ✍️</Text>
          </View>
        ) : null}
      />

      <ReviewCreateModal
        open={isReviewModalOpen}
        onCloseAction={handleCloseReviewModal}
        onSubmitAction={handleSubmitReview}
        onPressAiSuggestionAction={handleAiTagSuggestion}
        isSubmitting={isSubmittingReview}
      />

      <CustomAlertModal
        open={alertState.open}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        confirmText="확인"
        onConfirmAction={closeAlert}
      />

      {commentModalReview && (
        <ReviewCommentModal
          visible={!!commentModalReview}
          reviewId={commentModalReview.id}
          commentCount={commentModalReview.count}
          accessToken={accessToken}
          onClose={() => setCommentModalReview(null)}
          onCommentAdded={() => {
            setCommentModalReview((prev) => prev ? { ...prev, count: prev.count + 1 } : null);
            getReviews();
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  writeButton: {
    backgroundColor: AppColors.primaryBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  writeButtonText: {
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  reviewCard: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEE",
  },
  authorInfo: {
    marginLeft: 10,
    flex: 1,
  },
  nickname: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: AppColors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  content: {
    fontSize: 15,
    color: "#4D4D4D",
    lineHeight: 22,
    marginBottom: 12,
  },
  imageRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  imageWrapper: { flex: 1, aspectRatio: 1, borderRadius: 8, overflow: "hidden" },
  reviewImage: { width: "100%", height: "100%", backgroundColor: "#F9F9F9" },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlayText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#BBB",
    fontSize: 14,
  },
});

export default ShopReview;
