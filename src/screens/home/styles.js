import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bottomView: {
    alignSelf: "flex-end",
    height: 5,
    marginTop: -20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  overlay_f_b_1: {},
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  footer_icon: {
    alignItems: "center",
    backgroundColor: "transparent",
    color: "black",
  },
  button_fin: {
    backgroundColor: "#c90000",
    borderRadius: 20,
    gap: 10,
    paddingHorizontal: 40,
  },
  buttons_footer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  info_icon_logos: { flexDirection: "row", gap: 10, alignItems: "center" },
  logo_pippo: { width: 70, height: 50 },
  logo: { width: 60, height: 60 },
  title_overlay_finish: {
    justifyContent: "center",
    alignItems: "center",
  },
  overlay_text_finish: { fontSize: 18 },
  overlay_f_b: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  overlay_finish: {
    padding: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 50,
  },
  last_title_name: { fontSize: 14 },
  name_style: { textTransform: "capitalize" },
  not_data: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container_info_content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 30,
  },
  container_info: {
    overflow: "hidden",
    borderRadius: 10,
    /*  paddingHorizontal: 20, */
  },
  subtitle: { color: "#c90000", fontSize: 12 },
  last_title: { marginBottom: 20, fontWeight: "bold" },
  flex: { flex: 1, paddingHorizontal: 20 },
  /* last: { flex: 1 }, */
  card_percent: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -20,
    gap: 10,
  },
  container: {
    flex: 1,
    padding: 0,
    gap: 20,
    height: "100%",
    paddingBottom: 0,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  info_icon: { width: 30 },
  buttons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttons_m: { width: "49%" },
  button: {
    backgroundColor: "#c90000",
    borderRadius: 20,
    gap: 10,
  },
  card_route: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  card_slider_icon: { marginBottom: 20, marginRight: 10 },
  card_slider: {
    marginTop: 15,
    width: "100%",
    flexDirection: "row",
  },
  text_header: { color: "black" },
  date: { textTransform: "capitalize", color: "black" },
  last: { marginTop: 20, height: 500 },
  overlay: { padding: 20, width: "90%", height: "50%", borderRadius: 20 },

  overlay_list: {
    flex: 1,
  },

  date_placas: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placas_main: {
    backgroundColor: "#ffcc00",
    paddingHorizontal: 1,
    paddingVertical: 1,
  },
  placas: {
    textTransform: "uppercase",
    fontWeight: "bold",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  title_overlay: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "center",
    marginBottom: 20,
  },
  overlay_text: {
    fontSize: 20,
    textAlign: "center",
    color: "#c90000",
    width: "90%",
  },
  overlay_close: { top: 3 },
  route_name: {
    fontWeight: "bold",
    fontSize: 15,
    textDecorationLine: "underline",
    textTransform: "capitalize",
  },
});
