import React, { useState } from "react";
import { TextInput, View, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons"; 

type TextInputLoginProps = {
  placeholder: string;
  IconComponent: React.ElementType;
  onChangeText: (text: string) => void;
  isPassword?: boolean;
};

export default function TextInputLogin({
  placeholder,
  IconComponent,
  onChangeText,
  isPassword = false, 
}: TextInputLoginProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {IconComponent && (
        <IconComponent size={24} color="#000000" strokeWidth={1} />
      )}
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !isPasswordVisible} 
      />
      {isPassword && (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
