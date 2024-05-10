import { ListItem } from "@rneui/themed";
import { Icon } from "react-native-elements";

keyExtractor = (item, index) => index.toString();

export const renderItem = ({ item, onPress, icon, iconSize }) => {
  return (
    <ListItem bottomDivider onPress={() => onPress()}>
      {icon && (
        <Icon name={icon?.name} color={icon?.color} size={iconSize || 20} />
      )}
      <ListItem.Content>
        <ListItem.Title style={item?.nameStyle}>{item?.name}</ListItem.Title>
        {item?.subtitle && (
          <ListItem.Subtitle style={item?.subtitleStyle}>
            {item?.subtitle}
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
};
