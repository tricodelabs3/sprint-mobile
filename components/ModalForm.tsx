import React from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";

interface Field {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric";
}

// Um FormField pode ser um único Field ou uma lista de Fields (para uma linha/row)
type FormField = Field | Field[];

interface ModalFormProps {
  visible: boolean;
  title: string;
  // O array de fields agora aceita Field ou Field[]
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
    const renderField = (field: Field, isRowItem: boolean = false, index: number) => (
        // Se for um item de linha, usa styles.rowItem
        <View key={index} style={[styles.field, isRowItem && styles.rowItem]}>
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

          {/* Mapeia sobre FormField[] */}
          {fields.map((formField, index) => {
              // Verifica se o item é um array de fields (uma linha)
              if (Array.isArray(formField)) {
                  return (
                      <View key={index} style={styles.rowContainer}>
                          {/* Renderiza cada campo da linha com a flag isRowItem=true */}
                          {formField.map((field, subIndex) => renderField(field, true, subIndex))}
                      </View>
                  );
              }
              // Caso contrário, é um único campo
              return renderField(formField, false, index);
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
    padding: 20,
    width: "85%",
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
  field: { marginBottom: 10 },
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
  // NOVO ESTILO: Container para uma linha de campos
  rowContainer: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      marginBottom: 0 
  }, 
  // NOVO ESTILO: Item dentro de uma linha
  rowItem: {
      flex: 1, // Faz com que ocupe o espaço dividido
      marginRight: 10, // Espaçamento entre os campos da linha
      marginBottom: 10 // Margem na parte inferior
  }
});