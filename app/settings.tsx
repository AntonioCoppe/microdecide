import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { 
  User, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Info, 
  ChevronRight, 
  Moon,
  Mail,
  Camera,
  Heart,
  Calendar,
  Wifi,
  Bluetooth,
  Key,
  MapPin,
  CreditCard,
  HelpCircle,
  LogOut
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [emailUnsubscribeEnabled, setEmailUnsubscribeEnabled] = useState(true);
  const [photoDuplicatesEnabled, setPhotoDuplicatesEnabled] = useState(true);
  const [workoutRemindersEnabled, setWorkoutRemindersEnabled] = useState(true);

  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  const toggleLocation = () => setLocationEnabled(!locationEnabled);
  const toggleDarkMode = () => setDarkModeEnabled(!darkModeEnabled);
  const toggleEmailUnsubscribe = () => setEmailUnsubscribeEnabled(!emailUnsubscribeEnabled);
  const togglePhotoDuplicates = () => setPhotoDuplicatesEnabled(!photoDuplicatesEnabled);
  const toggleWorkoutReminders = () => setWorkoutRemindersEnabled(!workoutRemindersEnabled);

  const handleExportData = () => {
    console.log('Exporting data...');
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const settingsSections = [
    {
      title: 'Profile',
      icon: <User size={20} color="#4A90E2" />,
      items: [
        { label: 'Edit Profile', icon: <User size={18} color="#7F8C8D" />, action: () => console.log('Edit profile') },
        { label: 'Account Settings', icon: <Key size={18} color="#7F8C8D" />, action: () => console.log('Account settings') },
      ]
    },
    {
      title: 'Notifications',
      icon: <Bell size={20} color="#4A90E2" />,
      items: [
        { 
          label: 'Push Notifications', 
          icon: <Bell size={18} color="#7F8C8D" />, 
          action: toggleNotifications,
          rightElement: (
            <Switch 
              value={notificationsEnabled} 
              onValueChange={toggleNotifications}
              trackColor={{ false: '#E0E0E0', true: '#4A90E2' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#F0F0F0'}
            />
          )
        },
        { 
          label: 'Email Unsubscribe Suggestions', 
          icon: <Mail size={18} color="#7F8C8D" />, 
          action: toggleEmailUnsubscribe,
          rightElement: (
            <Switch 
              value={emailUnsubscribeEnabled} 
              onValueChange={toggleEmailUnsubscribe}
              trackColor={{ false: '#E0E0E0', true: '#4A90E2' }}
              thumbColor={emailUnsubscribeEnabled ? '#FFFFFF' : '#F0F0F0'}
            />
          )
        },
        { 
          label: 'Workout Reminders', 
          icon: <Calendar size={18} color="#7F8C8D" />, 
          action: toggleWorkoutReminders,
          rightElement: (
            <Switch 
              value={workoutRemindersEnabled} 
              onValueChange={toggleWorkoutReminders}
              trackColor={{ false: '#E0E0E0', true: '#4A90E2' }}
              thumbColor={workoutRemindersEnabled ? '#FFFFFF' : '#F0F0F0'}
            />
          )
        },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: <Shield size={20} color="#4A90E2" />,
      items: [
        { 
          label: 'Location Services', 
          icon: <MapPin size={18} color="#7F8C8D" />, 
          action: toggleLocation,
          rightElement: (
            <Switch 
              value={locationEnabled} 
              onValueChange={toggleLocation}
              trackColor={{ false: '#E0E0E0', true: '#4A90E2' }}
              thumbColor={locationEnabled ? '#FFFFFF' : '#F0F0F0'}
            />
          )
        },
        { label: 'Connected Integrations', icon: <Wifi size={18} color="#7F8C8D" />, action: () => console.log('Connected integrations') },
        { label: 'Bluetooth Devices', icon: <Bluetooth size={18} color="#7F8C8D" />, action: () => console.log('Bluetooth devices') },
      ]
    },
    {
      title: 'Data Management',
      icon: <Download size={20} color="#4A90E2" />,
      items: [
        { label: 'Export My Data', icon: <Download size={18} color="#7F8C8D" />, action: handleExportData },
        { label: 'Delete Account', icon: <Trash2 size={18} color="#FF6B6B" />, action: handleDeleteAccount },
      ]
    },
    {
      title: 'Preferences',
      icon: <Heart size={20} color="#4A90E2" />,
      items: [
        { 
          label: 'Dark Mode', 
          icon: <Moon size={18} color="#7F8C8D" />, 
          action: toggleDarkMode,
          rightElement: (
            <Switch 
              value={darkModeEnabled} 
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#E0E0E0', true: '#4A90E2' }}
              thumbColor={darkModeEnabled ? '#FFFFFF' : '#F0F0F0'}
            />
          )
        },
      ]
    },
    {
      title: 'Support',
      icon: <HelpCircle size={20} color="#4A90E2" />,
      items: [
        { label: 'Help Center', icon: <HelpCircle size={18} color="#7F8C8D" />, action: () => console.log('Help center') },
        { label: 'About MicroDecide', icon: <Info size={18} color="#7F8C8D" />, action: () => console.log('About') },
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white pt-12 pb-4 px-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <View className="flex-row items-center mb-3">
              <View className="mr-2">
                {section.icon}
              </View>
              <Text className="text-lg font-bold text-gray-900">{section.title}</Text>
            </View>
            
            <View className="bg-white rounded-xl shadow-sm overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  className={`flex-row items-center p-4 ${itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                  onPress={item.action}
                >
                  <View className="mr-3">
                    {item.icon}
                  </View>
                  <Text className={`flex-1 ${item.label === 'Delete Account' ? 'text-red-500' : 'text-gray-900'}`}>
                    {item.label}
                  </Text>
                  {item.rightElement ? (
                    item.rightElement
                  ) : (
                    <ChevronRight size={20} color="#7F8C8D" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity 
          className="bg-white rounded-xl shadow-sm p-4 flex-row items-center justify-center mt-2"
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FF6B6B" />
          <Text className="text-red-500 font-bold ml-2">Log Out</Text>
        </TouchableOpacity>

        {/* Debug Section */}
        <View className="mt-8 mb-6">
          <View className="flex-row items-center mb-3">
            <Text className="text-lg font-bold text-gray-900">Debug Options</Text>
          </View>
          
          <View className="bg-white rounded-xl shadow-sm overflow-hidden">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
              <Text className="text-gray-900">Reset Onboarding</Text>
              <ChevronRight size={20} color="#7F8C8D" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
              <Text className="text-gray-900">Clear Cache</Text>
              <ChevronRight size={20} color="#7F8C8D" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center p-4">
              <Text className="text-gray-900">View Logs</Text>
              <ChevronRight size={20} color="#7F8C8D" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}