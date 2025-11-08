import React from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";

interface Field {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric";
}

type FormField = Field | Field[];

interface ModalFormProps {
  visible: boolean;
  title: string;
  fields: FormField[]; 
  onSubmit: (values: any) => void;
  onClose: () => void;
  submitLabel?: string;
}

export default function ModalForm({
  visible,
  title,
  fields, 
  onSubmit,
  onClose,
  submitLabel = "Adicionar",
}: ModalFormProps) {
    
    // Função para renderizar um único campo
    const renderField = (field: Field, index: number, totalFields: number) => {
        const isRowItem = totalFields > 1;

        const containerStyle = [
            isRowItem ? styles.rowItemContainer : styles.singleItemContainer, 
            isRowItem && index < totalFields - 1 && styles.rowMarginRight
        ];

        return (
            <View 
                key={index} 
                style={containerStyle}
            >
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChangeText={field.onChangeText}
                    keyboardType={field.keyboardType || "default"}
                />
            </View>
        );
    };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          {fields.map((formField, index) => {
              if (Array.isArray(formField)) {
                  return (
                      <View key={index} style={styles.rowContainer}>
                          {formField.map((field, subIndex) => 
                            renderField(field, subIndex, formField.length)
                          )}
                      </View>
                  );
              }
              return renderField(formField, index, 1);
          })}

          <Pressable style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>{submitLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },


  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  close: { fontSize: 20, color: "#666" },
  
  singleItemContainer: { marginBottom: 10 }, 
  
  rowItemContainer: { 
    flex: 1, 
    marginBottom: 10,
    minWidth: 0,
  }, 
  
  label: { fontSize: 14, color: "#555", marginBottom: 4 },
  input: {
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  
  rowContainer: { 
      flexDirection: 'row', 
  }, 
  rowMarginRight: {
      marginRight: 10,
  }
});