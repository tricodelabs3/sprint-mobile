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
            // Container para um único item (coluna) ou um item de linha
            isRowItem ? styles.rowItemContainer : styles.singleItemContainer, 
            // 🟢 Aplica marginRight APENAS se for um item de linha E não for o último
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
                      // 🟢 rowContainer: Apenas flexDirection: 'row' para garantir o uso total do flex
                      <View key={index} style={styles.rowContainer}>
                          {formField.map((field, subIndex) => 
                            renderField(field, subIndex, formField.length)
                          )}
                      </View>
                  );
              }
              // Caso contrário, é um único campo (totalFields = 1)
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
  
  // ESTILOS DE CONTAINER DE CAMPO REVISADOS
  singleItemContainer: { marginBottom: 10 }, 
  
  // 🟢 rowItemContainer: Apenas flex: 1 e marginBottom (sem margens horizontais)
  rowItemContainer: { 
    flex: 1, 
    marginBottom: 10,
    minWidth: 0, // Essencial para evitar que o texto longo force a largura
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
  
  // Container de linha (parent)
  // 🟢 rowContainer: Limpo para apenas row, permitindo que os filhos flex: 1 se expandam
  rowContainer: { 
      flexDirection: 'row', 
  }, 
  // 🟢 rowMarginRight: Novo estilo que aplica a margem necessária
  rowMarginRight: {
      marginRight: 10,
  }
});