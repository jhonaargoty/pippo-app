import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  is_modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal_text: { fontSize: 16 },
  modal_view: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "column",
    gap: 20,
  },
  input: { textAlign: "right", fontSize: 14, fontWeight: "bold" },
  form: {
    height: "100px",
  },
  optionText: { textTransform: "capitalize", fontSize: 13 },
  optionTextSelect: { color: "white" },
  radio_main: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    padding: 0,
    gap: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    flex: 1,
  },
  selectedOption: {
    backgroundColor: "#c90000",
    borderColor: "#c90000",
  },

  field_input: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "left",
    padding: 8,
    borderStyle: "solid",
    borderWidth: 0.2,
    borderColor: "#000",
    borderRadius: 5,
  },
  field_icon: {
    gap: 10,
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
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
  },
  card_view: { flex: 1 },
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
  info_ruta: { textTransform: "capitalize", color: "#c90000" },
  litros: { color: "#c90000", fontWeight: "bold", fontSize: 20 },
});
