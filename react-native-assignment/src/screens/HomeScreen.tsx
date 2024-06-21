import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Button,
  FlatList,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faMoon,
  faRightFromBracket,
  faSun,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import ErrorModal from '../../ErrorModal';
import {
  deleteTodoItem,
  addTodoItem,
  getTodoItems,
  TodoItem,
} from '../../helper';

const colors = {
  blue: '#007AFF',
  black: '#000000',
  white: '#FFFFFF',
  grey: '#808080',
  darkblue: '#054173',
  red: '#e6556d',
};

const Homescreen = () => {
  const [backgroundColor, setBackgroundColor] = useState(colors.darkblue);
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [newTodoItem, setNewTodoItem] = useState('');
  const [error, setError] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchTodoItems();
  }, []);

  const fetchTodoItems = () => {
    getTodoItems(0, 100)
      .then(items => setTodoItems(items))
      .catch(error => {
        console.error('Error fetching todo items:', error);
        setError(error.message);
        setModalVisible(true);
      });
  };

  const deleteAndRefresh = (itemId: string) => {
    deleteTodoItem(itemId)
      .then(() => fetchTodoItems())
      .catch(error => {
        console.error('Error deleting todo item:', error);
        setError(error.message);
        setModalVisible(true);
      });
  };

  const toggleBackgroundColor = () => {
    setBackgroundColor(prevColor =>
      prevColor === colors.white ? colors.darkblue : colors.white,
    );
  };

  const textColor =
    backgroundColor === colors.white ? colors.black : colors.white;
  const renderItem = ({item}: {item: TodoItem}) => (
    <View style={styles.todoItem}>
      <Text
        style={[styles.sectionDescription, {color: textColor, marginLeft: 10}]}>
        {item.title}
      </Text>
      <TouchableOpacity
        style={{marginRight: 20}}
        onPress={() => {
          deleteTodoItem(item.id)
            .then(() => fetchTodoItems())
            .catch(error => {
              console.error('Error deleting todo item:', error);
              setError(error.message);
              setModalVisible(true);
            });
        }}>
        <FontAwesomeIcon icon={faTrash} size={24} color={colors.red} />
      </TouchableOpacity>
    </View>
  );

  const handleAddTodo = () => {
    if (!newTodoItem.trim()) {
      return; // Prevent adding empty todo item
    }

    addTodoItem(newTodoItem.trim())
      .then(() => {
        setNewTodoItem('');
        fetchTodoItems();
      })
      .catch(error => {
        setError(error.message);
        setModalVisible(true);
      });
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.sectionTitle, {color: colors.blue}]}>
            SCOPEX{' '}
            <Text style={[styles.sectionTitle, {color: textColor}]}>TODO</Text>
          </Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={toggleBackgroundColor}>
              <FontAwesomeIcon
                icon={backgroundColor === colors.white ? faSun : faMoon}
                size={30}
                color={textColor}
                style={{marginRight: 10}}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesomeIcon
                icon={faRightFromBracket}
                size={20}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={todoItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.flatListContainer}
        />

        <View style={styles.bottomContainer}>
          <TextInput
            style={[
              styles.sectionDescription,
              {color: textColor, fontSize: 22, fontStyle: 'italic'},
            ]}
            placeholder="Add your to-do item(s)"
            placeholderTextColor={textColor}
            onChangeText={text => setNewTodoItem(text)}
            value={newTodoItem}
          />

          <TouchableOpacity style={styles.button} onPress={handleAddTodo}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ErrorModal
        visible={modalVisible}
        error={error}
        onClose={() => {
          setModalVisible(false);
          setError('');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.grey,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  flatListContainer: {
    flexGrow: 1,
  },
  button: {
    backgroundColor: colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    justifyContent: 'space-between', // Distribute space evenly
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.grey,
    paddingVertical: 10,

    flexShrink: 0, // Prevent container from shrinking when content grows
  },
});


export default Homescreen;
