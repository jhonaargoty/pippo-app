import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  
  field_input: {
        width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "left",
    padding: 10,
    borderStyle: "solid",
    borderWidth: 0.2,
    borderColor: "#000",
    borderRadius: 5,
    
  },
  field: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  field_info: {
    textTransform: "capitalize",
  },
  content: {
    gap: 5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 20,
    height: "100%",
  },
  info_main: {
    alignItems: "center",
    marginBottom: 5,
    width: "100%",
    flex: 1,
  },
  info_navigation: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  date: { textTransform: "capitalize" },
  info_ruta: { textTransform: "capitalize", color:"#c90000" },
  litros: { color: "#c90000", fontWeight: "bold", fontSize: 20 },
});
