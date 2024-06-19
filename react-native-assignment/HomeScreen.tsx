import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { addTodoItem, deleteTodoItem, getTodoItems } from './helper';

function Homescreen(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Define your color scheme
  const colors = {
    blue: '#007AFF',
    black: '#000000',
    white: '#FFFFFF',
    grey: '#808080',
  };

  const [backgroundColor, setBackgroundColor] = useState(colors.white);

  const toggleBackgroundColor = () => {
    setBackgroundColor(prevColor =>
      prevColor === colors.white ? colors.black : colors.white,
    );
  };

  const backgroundStyle = {
    backgroundColor: backgroundColor,
  };

  const [todoItems, setTodoItems] = useState([]);
  const [newTodoItem, setNewTodoItem] = useState('');

  useEffect(() => {
    getTodoItems(0, 100).then(items => setTodoItems(items));
  }, []);

  // Determine text color based on the background color
  const textColor = backgroundColor === colors.white ? colors.black : colors.white;

  return (
    <SafeAreaView style={[styles.safeArea, backgroundStyle]}>
     
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.blue }]}>SCOPEX <Text style={[styles.sectionTitle, { color: textColor }]}>TODO</Text></Text>
          <Button title="Toggle Background" onPress={toggleBackgroundColor} />
        </View>
        <View style={styles.sectionContainer}>
          {todoItems.map((item: any) => (
            <View key={item.id} style={styles.todoItem}>
              <Text style={[styles.sectionDescription, { color: textColor }]}>{item.title}</Text>
              <Button
                title="Delete"
                onPress={() => {
                  deleteTodoItem(item.id).then(() => {
                    getTodoItems(0, 10).then(items => {
                      setTodoItems(items);
                    });
                  });
                }}
              />
            </View>
          ))}
        </View>
        <View style={[styles.sectionContainer,{justifyContent:'flex-end'}]}>
          <TextInput
            style={[styles.sectionDescription, { color: textColor,fontSize: 22,fontStyle:'italic'  }]}
            placeholder="Add your to-do item(s)"
            placeholderTextColor={textColor}
            onChange={e => setNewTodoItem(e.nativeEvent.text)}
          />
          <Button
            title="Add"
            onPress={() => {
              addTodoItem(newTodoItem).then(() => {
                getTodoItems(0, 10).then(items => {
                  setTodoItems(items);
                });
              });
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    flexDirection:'row',
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  todoItem: {
    fontSize: 18,
    fontWeight: '400',
    borderBottomWidth: 1,
    padding: 8,
    borderBottomColor: 'gray', // Use colors.grey for grey color
  },
});

export default Homescreen;
