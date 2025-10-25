import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreenComponent from './LoginScreenComponent';
import EditNamesScreenComponent from './EditNamesScreenComponent';
import { useNavigation, navigate } from '@react-navigation/native';
import { ThemeContext } from '.././context/ThemeContext';



import { useI18n } from '.././context/I18nContext'; 

const HomeStack = createNativeStackNavigator();

const HomeStackNavigatorComponent = () => {

  const navigation = useNavigation();
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { language, setLanguage, translate } = useI18n();
  
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Tabs" 
        options = {{
          title: translate('home'),
          headerShown: false,
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,
        }}
        component={LoginScreenComponent} />

      <HomeStack.Screen name="EditNames" 
        options = {{
          title: translate('update_names'),
          headerShown: true,
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,
        }}
        component={EditNamesScreenComponent} />

    </HomeStack.Navigator>
  );
};

export default HomeStackNavigatorComponent;


/*



*/