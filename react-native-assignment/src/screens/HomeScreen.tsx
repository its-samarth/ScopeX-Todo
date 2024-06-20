import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Button,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faMoon,
  faRightFromBracket,
  faSun,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import ErrorModal from '../../ErrorModal';
import { deleteTodoItem,addTodoItem, getTodoItems, TodoItem } from '../../helper';


function Homescreen(): JSX.Element {
  const colors = {
    blue: '#007AFF',
    black: '#000000',
    white: '#FFFFFF',
    grey: '#808080',
    darkblue: '#054173',
    red: '#e6556d',
  };

  const [backgroundColor, setBackgroundColor] = useState(colors.darkblue);

  const toggleBackgroundColor = () => {
    setBackgroundColor(prevColor =>
      prevColor === colors.white ? colors.darkblue : colors.white,
    );
  };

  const backgroundStyle = {
    backgroundColor: backgroundColor,
  };

  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [newTodoItem, setNewTodoItem] = useState('');
  const [error, setError] = useState<string>(''); // State to hold error message
  const [modalVisible, setModalVisible] = useState<boolean>(false); // State to control modal visibility

  useEffect(() => {
    getTodoItems(0, 100).then(items => setTodoItems(items));
  }, []);

  const textColor =
    backgroundColor === colors.white ? colors.black : colors.white;

  return (
    <SafeAreaView style={[styles.safeArea, backgroundStyle]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={[styles.sectionContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={[styles.sectionTitle, { color: colors.blue }]}>
          SCOPEX{' '}
          <Text style={[styles.sectionTitle, { color: textColor }]}>TODO</Text>
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={toggleBackgroundColor}>
            <FontAwesomeIcon
              icon={backgroundColor === 'white' ? faSun : faMoon}
              size={30}
              color={textColor}
              style={{ marginRight: 10 }} // Adjust the spacing between icons
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={faRightFromBracket}
              size={20}
              color={'black'}
            />
          </TouchableOpacity>
        </View>
      </View>

        <View style={styles.sectionContainer}>
          {todoItems.map((item: any) => (
            <View
              key={item.id}
              style={[
                styles.todoItem,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}>
              <Text style={[styles.sectionDescription, {color: textColor}]}>
                {item.title}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  deleteTodoItem(item.id)
                    .then(() => {
                      getTodoItems(0, 20).then(items => {
                        setTodoItems(items);
                      });
                    })
                    .catch(error => {
                      console.error('Error adding todo item:', error);
                      setError(error.message);
                      setModalVisible(true); // Show modal
                    });
                }}>
                <FontAwesomeIcon icon={faTrash} size={24} color={colors.red} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={[styles.sectionContainer, styles.bottomContainer]}>
          <TextInput
            style={[
              styles.sectionDescription,
              {color: textColor, fontSize: 22, fontStyle: 'italic'},
            ]}
            placeholder="Add your to-do item(s)"
            placeholderTextColor={textColor}
            onChange={e => setNewTodoItem(e.nativeEvent.text)}
          />
          <Button
            title="Add"
            onPress={() => {
              addTodoItem(newTodoItem)
                .then(() => {
                  getTodoItems(0,100).then(items => {
                    setTodoItems(items);
                  });
                })
                .catch(error => {
                  setError(error.message);
                  setModalVisible(true); // Show modal
                });
            }}
          />
        </View>
        <ErrorModal
          visible={modalVisible}
          error={error}
          onClose={() => {
            setModalVisible(false); // Hide modal
            setError(''); // Clear error message
          }}
        />
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
    flexDirection: 'row',
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
  bottomContainer: {
    justifyContent: 'flex-end',
    marginBottom: 32,
  },
});

export default Homescreen;
