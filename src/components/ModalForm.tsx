// src/components/ModalForm.tsx
import React from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { Control, Controller, FieldValues, FieldErrors } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '../constants/Colors'; // 👈 Usando constante

// Definição da interface do campo de formulário
export interface FormField {
  name: string; // Nome do campo para o react-hook-form
  label: string;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
  // Adicione regras de validação se quiser passá-las por aqui
  // rules?: RegisterOptions; 
}

// O layout pode ser um campo único ou um array de campos (para linhas)
export type FormLayout = FormField | FormField[];

interface ModalFormProps<T extends FieldValues> {
  visible: boolean;
  title: string;
  fields: FormLayout[];
  onSubmit: () => void; // O handleSubmit do hook-form é passado para este onPress
  onClose: () => void;
  submitLabel?: string;
  control: Control<T>; // 👈 Recebe o controle do useForm
  errors: FieldErrors<T>; // 👈 Recebe os erros do formState
}

export default function ModalForm<T extends FieldValues>({
  visible,
  title,
  fields,
  onSubmit,
  onClose,
  submitLabel = "Adicionar",
  control,
  errors,
}: ModalFormProps<T>) {

  const renderField = (field: FormField, isRowItem: boolean, isLastInRow: boolean) => {
    const fieldError = errors[field.name];

    const containerStyle = [
        isRowItem ? styles.rowItemContainer : styles.singleItemContainer, 
        !isLastInRow && styles.rowMarginRight
    ];

    return (
        <View 
            key={field.name} 
            style={containerStyle}
        >
            <Text style={styles.label}>{field.label}</Text>
            
            {/* O Controller conecta o input ao estado e regras do react-hook-form */}
            <Controller
                control={control}
                name={field.name as any}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[styles.input, fieldError && styles.inputError]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder={field.placeholder}
                        keyboardType={field.keyboardType || "default"}
                    />
                )}
            />
            
            {/* Exibe mensagem de erro */}
            {fieldError && (
                <Text style={styles.errorText}>
                    {fieldError.message as string || 'Campo inválido'}
                </Text>
            )}
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
              <Ionicons name="close-circle-outline" size={24} color={Colors.textSecondary} /> 
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {fields.map((formLayout, index) => {
                if (Array.isArray(formLayout)) {
                    return (
                        <View key={`row-${index}`} style={styles.rowContainer}>
                            {formLayout.map((field, subIndex) => 
                              renderField(field, true, subIndex === formLayout.length - 1)
                            )}
                        </View>
                    );
                }
                return renderField(formLayout, false, true);
            })}
          </ScrollView>

          {/* O onSubmit agora é o handleSubmit do react-hook-form */}
          <Pressable style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>{submitLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ... Estilos usando Colors ...
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: '80%', 
    shadowColor: Colors.black,
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
  title: { fontSize: 18, fontWeight: "bold", color: Colors.text },
  singleItemContainer: { marginBottom: 10 }, 
  rowItemContainer: { 
    flex: 1, 
    marginBottom: 10,
    minWidth: 0,
  }, 
  rowMarginRight: {
      marginRight: 10,
  },
  label: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
  input: {
    backgroundColor: Colors.lightBackground,
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.lightBackground,
  },
  inputError: {
      borderColor: Colors.danger, 
      borderWidth: 1,
  },
  errorText: {
      color: Colors.danger,
      fontSize: 12,
      marginTop: 2,
  },
  button: {
    backgroundColor: Colors.action,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: Colors.actionIcon, fontWeight: "bold" },
  rowContainer: { 
      flexDirection: 'row', 
      flexWrap: 'wrap',
      justifyContent: 'space-between',
  }, 
});