import { CLOUDINARY_CONFIG } from "@/constants/config";
import { REVIEW_TAG_EMOJI } from "@/constants/reviewTags";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type CreateReviewPayload = {
  rating: number;
  content?: string;
  imageUrls?: string[];
  tags?: string[];
};

type Props = {
  open: boolean;
  onCloseAction: () => void;
  onSubmitAction: (payload: CreateReviewPayload) => Promise<void> | void;
  onPressAiSuggestionAction?: (content: string) => Promise<string[]> | string[];
  isSubmitting?: boolean;
};

const MAX_IMAGE_COUNT = 10;
const MAX_TAG_COUNT = 5;

const REVIEW_TAGS = Object.keys(REVIEW_TAG_EMOJI);

const CLOUDINARY_CLOUD_NAME = CLOUDINARY_CONFIG.CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = CLOUDINARY_CONFIG.UPLOAD_PRESET;
const CLOUDINARY_FOLDER = CLOUDINARY_CONFIG.FOLDER;

type ReviewFormErrors = {
  rating?: string;
  imageUrls?: string;
  submit?: string;
  aiTagSuggestion?: string;
};

export default function ReviewCreateModal({
  open,
  onCloseAction,
  onSubmitAction,
  onPressAiSuggestionAction,
  isSubmitting = false,
}: Props) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const trimmedContent = useMemo(() => content.trim(), [content]);
  const isBusy = isSubmitting || isSuggestingTags || isUploadingImages;

  const resetForm = () => {
    setRating(5);
    setContent("");
    setImageUrls([]);
    setSelectedTags([]);
    setErrors({});
    setIsSuggestingTags(false);
    setIsUploadingImages(false);
  };

  const handleClose = () => {
    if (isBusy) return;
    resetForm();
    onCloseAction();
  };

  const handleToggleTag = (tag: string) => {
    if (isBusy) return;

    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((item) => item !== tag);
      }

      if (prev.length >= MAX_TAG_COUNT) {
        return prev;
      }

      return [...prev, tag];
    });
  };

  const handleRemoveImageUrl = (target: string) => {
    if (isBusy) return;
    setImageUrls((prev) => prev.filter((url) => url !== target));
  };

  const uploadImageToCloudinary = async (uri: string) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error("Cloudinary 설정이 없습니다.");
    }

    const formData = new FormData();

    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: `review-${Date.now()}.jpg`,
    } as any);

    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", CLOUDINARY_FOLDER);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const json = await response.json();

    if (!response.ok || !json.secure_url) {
      console.error("Cloudinary upload error:", json);
      throw new Error("Cloudinary 이미지 업로드에 실패했습니다.");
    }

    return json.secure_url as string;
  };

  const handlePickImages = async () => {
    if (isBusy) return;

    if (imageUrls.length >= MAX_IMAGE_COUNT) {
      setErrors((prev) => ({
        ...prev,
        imageUrls: `이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있어.`,
      }));
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setErrors((prev) => ({
          ...prev,
          imageUrls: "사진 접근 권한이 필요해.",
        }));
        return;
      }

      const remainingCount = MAX_IMAGE_COUNT - imageUrls.length;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: remainingCount,
        quality: 0.85,
      });

      if (result.canceled) return;

      setIsUploadingImages(true);
      setErrors((prev) => ({ ...prev, imageUrls: undefined }));

      const uploadedUrls: string[] = [];

      for (const asset of result.assets.slice(0, remainingCount)) {
        const uploadedUrl = await uploadImageToCloudinary(asset.uri);
        uploadedUrls.push(uploadedUrl);
      }

      setImageUrls((prev) => {
        const next = [...prev];

        for (const url of uploadedUrls) {
          if (!next.includes(url) && next.length < MAX_IMAGE_COUNT) {
            next.push(url);
          }
        }

        return next;
      });
    } catch (error) {
      console.error("Failed to upload review images:", error);
      setErrors((prev) => ({
        ...prev,
        imageUrls: "사진 업로드 중 문제가 발생했어. 다시 시도해줘.",
      }));
    } finally {
      setIsUploadingImages(false);
    }
  };

  const validate = () => {
    const nextErrors: ReviewFormErrors = {};

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      nextErrors.rating = "평점은 1점부터 5점까지 선택해야 해.";
    }

    if (imageUrls.length > MAX_IMAGE_COUNT) {
      nextErrors.imageUrls = `이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있어.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAiTagSuggestion = async () => {
    if (!trimmedContent) {
      setErrors((prev) => ({
        ...prev,
        aiTagSuggestion: "리뷰 내용을 먼저 입력해줘.",
      }));
      return;
    }

    if (!onPressAiSuggestionAction) {
      setErrors((prev) => ({
        ...prev,
        aiTagSuggestion: "AI 태그 추천 기능이 아직 연결되지 않았어.",
      }));
      return;
    }

    try {
      setIsSuggestingTags(true);
      setErrors((prev) => ({ ...prev, aiTagSuggestion: undefined }));

      const result = await onPressAiSuggestionAction(trimmedContent);

      const suggestedTags = Array.isArray(result)
        ? result.filter((item): item is string => Boolean(item))
        : [];

      if (suggestedTags.length === 0) {
        setErrors((prev) => ({
          ...prev,
          aiTagSuggestion:
            "추천할 태그를 찾지 못했어. 내용을 조금 더 자세히 적어줘.",
        }));
        return;
      }

      setSelectedTags((prev) => {
        const merged = [...prev];

        for (const tag of suggestedTags) {
          if (!Object.prototype.hasOwnProperty.call(REVIEW_TAG_EMOJI, tag)) {
            continue;
          }

          if (!merged.includes(tag)) {
            merged.push(tag);
          }

          if (merged.length >= MAX_TAG_COUNT) {
            break;
          }
        }

        return merged;
      });
    } catch {
      setErrors((prev) => ({
        ...prev,
        aiTagSuggestion:
          "AI 태그 추천 중 문제가 발생했어. 잠시 후 다시 시도해줘.",
      }));
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setErrors({});

      const payload: CreateReviewPayload = {
        rating,
        ...(trimmedContent ? { content: trimmedContent } : {}),
        ...(imageUrls.length > 0 ? { imageUrls } : {}),
        ...(selectedTags.length > 0 ? { tags: selectedTags } : {}),
      };

      await onSubmitAction(payload);
      resetForm();
      onCloseAction();
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: "리뷰 등록 중 문제가 발생했어. 다시 시도해줘.",
      }));
    }
  };

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={handleClose} />

        <SafeAreaView edges={["bottom"]} style={styles.sheetWrapper}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>리뷰 등록</Text>
              <Pressable
                onPress={handleClose}
                disabled={isBusy}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.section}>
                <Text style={styles.label}>
                  평점 <Text style={styles.required}>*</Text>
                </Text>

                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((value) => {
                    const active = value <= rating;

                    return (
                      <Pressable
                        key={value}
                        onPress={() => setRating(value)}
                        disabled={isBusy}
                        style={styles.starButton}
                      >
                        <Text
                          style={[
                            styles.starText,
                            active ? styles.starActive : styles.starInactive,
                          ]}
                        >
                          ★
                        </Text>
                      </Pressable>
                    );
                  })}

                  <Text style={styles.ratingValue}>{rating}점</Text>
                </View>

                {errors.rating ? (
                  <Text style={styles.errorText}>{errors.rating}</Text>
                ) : null}
              </View>

              <View style={styles.section}>
                <View style={styles.sectionRow}>
                  <Text style={styles.label}>태그 선택</Text>

                  <Pressable
                    onPress={handleAiTagSuggestion}
                    disabled={
                      isBusy ||
                      !trimmedContent ||
                      selectedTags.length >= MAX_TAG_COUNT
                    }
                    style={[
                      styles.secondaryButton,
                      (isBusy ||
                        !trimmedContent ||
                        selectedTags.length >= MAX_TAG_COUNT) &&
                        styles.disabledButton,
                    ]}
                  >
                    <Text style={styles.secondaryButtonText}>
                      {isSuggestingTags ? "추천 중..." : "AI 태그 추천"}
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.tagContainer}>
                  {REVIEW_TAGS.map((tag) => {
                    const selected = selectedTags.includes(tag);

                    return (
                      <Pressable
                        key={tag}
                        onPress={() => handleToggleTag(tag)}
                        disabled={
                          isBusy ||
                          (!selected && selectedTags.length >= MAX_TAG_COUNT)
                        }
                        style={[
                          styles.tagChip,
                          selected && styles.tagChipSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.tagChipText,
                            selected && styles.tagChipTextSelected,
                          ]}
                        >
                          {REVIEW_TAG_EMOJI[tag]} {tag}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {errors.aiTagSuggestion ? (
                  <Text style={styles.errorText}>{errors.aiTagSuggestion}</Text>
                ) : null}
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>내용</Text>

                <TextInput
                  value={content}
                  onChangeText={setContent}
                  placeholder="리뷰 내용을 입력해줘."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  editable={!isBusy}
                  style={styles.textArea}
                />
              </View>

              <View style={styles.section}>
                <View style={styles.sectionRow}>
                  <Text style={styles.label}>리뷰 사진</Text>

                  <Pressable
                    onPress={handlePickImages}
                    disabled={isBusy || imageUrls.length >= MAX_IMAGE_COUNT}
                    style={[
                      styles.primaryDarkButton,
                      (isBusy || imageUrls.length >= MAX_IMAGE_COUNT) &&
                        styles.disabledButton,
                    ]}
                  >
                    <Text style={styles.primaryDarkButtonText}>
                      {isUploadingImages ? "업로드 중..." : "사진 추가"}
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.helperText}>
                  최대 {MAX_IMAGE_COUNT}장까지 등록할 수 있어.
                </Text>

                {isUploadingImages ? (
                  <View style={styles.uploadingRow}>
                    <ActivityIndicator size="small" color="#FF8C00" />
                    <Text style={styles.uploadingText}>
                      사진을 업로드하고 있어...
                    </Text>
                  </View>
                ) : null}

                {errors.imageUrls ? (
                  <Text style={styles.errorText}>{errors.imageUrls}</Text>
                ) : null}

                {imageUrls.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.previewScroll}
                  >
                    {imageUrls.map((url) => (
                      <View key={url} style={styles.previewItem}>
                        <Image
                          source={{ uri: url }}
                          style={styles.previewImage}
                        />
                        <Pressable
                          onPress={() => handleRemoveImageUrl(url)}
                          disabled={isBusy}
                          style={styles.previewRemoveButton}
                        >
                          <Text style={styles.previewRemoveText}>삭제</Text>
                        </Pressable>
                      </View>
                    ))}
                  </ScrollView>
                ) : null}
              </View>

              {errors.submit ? (
                <View style={styles.submitErrorBox}>
                  <Text style={styles.submitErrorText}>{errors.submit}</Text>
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                onPress={handleClose}
                disabled={isBusy}
                style={styles.footerGhostButton}
              >
                <Text style={styles.footerGhostButtonText}>취소</Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={isBusy}
                style={[
                  styles.footerPrimaryButton,
                  isBusy && styles.disabledButton,
                ]}
              >
                <Text style={styles.footerPrimaryButtonText}>
                  {isSubmitting ? "등록 중..." : "리뷰 등록"}
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  backdropTouch: { flex: 1 },
  sheetWrapper: { justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    minHeight: "70%",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  closeButton: { paddingHorizontal: 8, paddingVertical: 6 },
  closeButtonText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  scrollContent: { paddingBottom: 20 },
  section: { marginBottom: 22 },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: { fontSize: 15, fontWeight: "700", color: "#1F2937" },
  required: { color: "#EF4444" },
  starRow: { flexDirection: "row", alignItems: "center" },
  starButton: { marginRight: 4 },
  starText: { fontSize: 34, lineHeight: 40 },
  starActive: { color: "#FACC15" },
  starInactive: { color: "#D1D5DB" },
  ratingValue: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagChip: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  tagChipSelected: { borderColor: "#FF8C00", backgroundColor: "#FFF4E5" },
  tagChipText: { fontSize: 13, fontWeight: "500", color: "#4B5563" },
  tagChipTextSelected: { color: "#FF8C00", fontWeight: "700" },
  textArea: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondaryButtonText: { color: "#374151", fontSize: 13, fontWeight: "600" },
  primaryDarkButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryDarkButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  helperText: { marginTop: 8, fontSize: 12, color: "#6B7280" },
  uploadingRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  uploadingText: { fontSize: 13, color: "#6B7280" },
  errorText: { marginTop: 8, fontSize: 13, color: "#EF4444" },
  previewScroll: { marginTop: 12 },
  previewItem: { marginRight: 10 },
  previewImage: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  previewRemoveButton: {
    marginTop: 6,
    alignSelf: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  previewRemoveText: { color: "#EF4444", fontSize: 12, fontWeight: "600" },
  submitErrorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  submitErrorText: { color: "#DC2626", fontSize: 13 },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  footerGhostButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  footerGhostButtonText: { color: "#374151", fontSize: 15, fontWeight: "600" },
  footerPrimaryButton: {
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#111827",
  },
  footerPrimaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  disabledButton: { opacity: 0.5 },
});
