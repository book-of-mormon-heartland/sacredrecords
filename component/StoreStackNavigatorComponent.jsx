import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoreScreenComponent from './StoreScreenComponent';
import ItemReviewScreenComponent from './ItemReviewScreenComponent';
import { useI18n } from '.././context/I18nContext'; 
import { ThemeContext } from ".././context/ThemeContext";


const StoreStack = createNativeStackNavigator();

const StoreStackNavigatorComponent = () => {

  const { theme, setTheme } = useContext(ThemeContext);
  const { language, setLanguage, translate } = useI18n();
  
  return (
    <StoreStack.Navigator>
      <StoreStack.Screen name="Store" 
        options = {{
          title: translate('store'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,
        }}
        component={StoreScreenComponent} />
      <StoreStack.Screen name="ItemReview" 
        options = {{
          title: translate('item_review'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,
        }}
        component={ItemReviewScreenComponent} />

    </StoreStack.Navigator>
  );
};

export default StoreStackNavigatorComponent;