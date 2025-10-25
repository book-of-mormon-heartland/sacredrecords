import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreenComponent from './SettingsScreenComponent';
import EditProfileScreenComponent from './EditProfileScreenComponent';
import DeleteProfileScreenComponent from './DeleteProfileScreenComponent';
import DeleteAccountScreenComponent from './DeleteAccountScreenComponent';
import CancelSubscriptionScreenComponent from './CancelSubscriptionScreenComponent';
import { useNavigation, navigate } from '@react-navigation/native';
import { ThemeContext } from '.././context/ThemeContext';



import { useI18n } from '.././context/I18nContext'; 

const SettingsStack = createNativeStackNavigator();

const SettingsStackNavigatorComponent = () => {

  const navigation = useNavigation();
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { language, setLanguage, translate } = useI18n();
  
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Tabs" 
        options = {{
          title: translate('settings'),
          headerShown: true,
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,
        }}
        component={SettingsScreenComponent} />

      <SettingsStack.Screen name="EditProfile" 
        options = {{
          title: translate('update_profile'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,

        }}
        component={EditProfileScreenComponent} />

      <SettingsStack.Screen name="DeleteProfile" 
        options = {{
          title: translate('delete_profile_title'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,

        }}
        component={DeleteProfileScreenComponent} />

      <SettingsStack.Screen name="DeleteAccount" 
        options = {{
          title: translate('delete_account_title'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,

        }}
        component={DeleteAccountScreenComponent} />

      <SettingsStack.Screen name="CancelSubscription" 
        options = {{
          title: translate('cancel_subscription_title'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,

        }}
        component={CancelSubscriptionScreenComponent} />

    </SettingsStack.Navigator>
  );
};

export default SettingsStackNavigatorComponent;


/*



*/