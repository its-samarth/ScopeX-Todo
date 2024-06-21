import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faMoon,
  faRightFromBracket,
  faSun,
  faTrash,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import ErrorModal from '../../ErrorModal';
import {
  deleteTodoItem,
  addTodoItem,
  getTodoItems,
  updateTodoItem,
  TodoItem,
} from '../../helper';
import UpdateModal from '../components/UpdateModal';
import globalStyles from '../../styles';

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
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentTodoItem, setCurrentTodoItem] = useState<TodoItem | null>(null);

  const openUpdateModal = (item: TodoItem) => {
    setCurrentTodoItem(item);
    setIsUpdateModalVisible(true);
  };

  const handleUpdate = (updatedTitle: string) => {
    if (currentTodoItem) {
      const updatedItem = {...currentTodoItem, title: updatedTitle};
      updateAndRefresh(updatedItem);
    }
  };

  useEffect(() => {
    fetchTodoItems(0);
  }, []);

  const fetchTodoItems = async (page: number) => {
    if (loading || allItemsLoaded) return;

    setLoading(true);

    try {
      const items = await getTodoItems(page, 10);
      if (items.length === 0) {
        setAllItemsLoaded(true);
      } else {
        setTodoItems(prevItems => [...prevItems, ...items]);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching todo items:', error);
      if (page === 0) {
        fetchTodoItems(0); // Retry fetching the first page if it fails
      } else {
        setError(error.message);
        setModalVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteAndRefresh = (itemId: string) => {
    deleteTodoItem(itemId)
      .then(() => {
        setTodoItems(prevItems => prevItems.filter(item => item.id !== itemId));
        // No need to reset pagination or fetch items again
      })
      .catch(error => {
        console.error('Error deleting todo item:', error);
        setError(error.message);
        setModalVisible(true);
      });
  };

  const updateAndRefresh = (todoItem: TodoItem) => {
    updateTodoItem(todoItem)
      .then(() => {
        setTodoItems(prevItems =>
          prevItems.map(item => (item.id === todoItem.id ? todoItem : item)),
        );
      })
      .catch(error => {
        console.error('Error updating todo item:', error);
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

    const renderItem = ({ item }: { item: TodoItem }) => (
      <View style={styles.todoItem}>
        <Text
          style={[
            styles.sectionDescription,
            { color: textColor, marginLeft: 10 },
            globalStyles.text, // Apply global text style here
          ]}
        >
          {item.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => deleteAndRefresh(item.id)}
          >
            <FontAwesomeIcon icon={faTrash} size={24} color={colors.red} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => openUpdateModal(item)}
          >
            <FontAwesomeIcon icon={faEdit} size={24} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
    );
  
    const handleAddTodo = async () => {
      if (!newTodoItem.trim()) {
        return; // Prevent adding empty todo item
      }
  
      try {
        await addTodoItem(newTodoItem.trim());
        setNewTodoItem('');
        setTodoItems([]);
        setCurrentPage(0);
        setAllItemsLoaded(false);
        fetchTodoItems(0);
      } catch (error) {
        setError(error.message);
        setModalVisible(true);
      }
    };
  
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.sectionTitle, globalStyles.text, { color: colors.blue }]}>
              SCOPEX{' '}
              <Text style={[styles.sectionTitle, globalStyles.text, { color: textColor }]}>
                TODO
              </Text>
            </Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={toggleBackgroundColor}>
                <FontAwesomeIcon
                  icon={backgroundColor === colors.white ? faSun : faMoon}
                  size={30}
                  color={textColor}
                  style={{ marginRight: 10 }}
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
            onEndReached={() => fetchTodoItems(currentPage + 1)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="large" color={colors.blue} />
              ) : null
            }
          />
  
          <View style={styles.bottomContainer}>
            <TextInput
              style={[
                styles.sectionDescription,
                { color: textColor, fontSize: 22, fontStyle: 'italic' },
                globalStyles.text, // Apply global text style here
              ]}
              placeholder="Add your to-do item(s)"
              placeholderTextColor={textColor}
              onChangeText={text => setNewTodoItem(text)}
              value={newTodoItem}
            />
  
            <TouchableOpacity style={styles.button} onPress={handleAddTodo}>
              <Text style={[styles.buttonText, globalStyles.text]}>Add</Text>
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
        <UpdateModal
          visible={isUpdateModalVisible}
          onClose={() => setIsUpdateModalVisible(false)}
          onUpdate={handleUpdate}
          currentTitle={currentTodoItem ? currentTodoItem.title : ''}
        />
      </SafeAreaView>
    );
  };
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
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
  fontFamily: 'FiraCode-Regular', 
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.grey,
    paddingVertical: 10,
  },
});

export default Homescreen;
