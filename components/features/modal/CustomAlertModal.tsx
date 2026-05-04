import React from "react";
import { AppColors } from '@/constants/theme';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type CustomAlertType = "success" | "error" | "info" | "warning";

type Props = {
  open: boolean;
  type?: CustomAlertType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirmAction: () => void;
  onCancelAction?: () => void;
};

export default function CustomAlertModal({
  open,
  type = "info",
  title,
  message,
  confirmText = "확인",
  cancelText,
  onConfirmAction,
  onCancelAction,
}: Props) {
  const iconText =
    type === "success"
      ? "✓"
      : type === "error"
      ? "!"
      : type === "warning"
      ? "!"
      : "i";

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onCancelAction ?? onConfirmAction}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onCancelAction ?? onConfirmAction}
      >
        <Pressable
          style={styles.box}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={[styles.icon, styles[`${type}Icon`]]}>
            <Text style={styles.iconText}>{iconText}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.buttonRow}>
            {cancelText && onCancelAction ? (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancelAction}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirmAction}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.42)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  box: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 18,
    alignItems: "center",
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successIcon: {
    backgroundColor: "#E9F8EF",
  },
  errorIcon: {
    backgroundColor: "#FDECEC",
  },
  infoIcon: {
    backgroundColor: "#EAF3FF",
  },
  warningIcon: {
    backgroundColor: "#FFF4E5",
  },
  iconText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FF8C00",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    color: "#666666",
    textAlign: "center",
    marginBottom: 22,
  },
  buttonRow: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F3F3",
  },
  confirmButton: {
    backgroundColor: "#FF8C00",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#666666",
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
