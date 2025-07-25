import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type TodoType = {
  id: number;
  title: string;
  isDone: boolean;
}

export default function Index() {

  const todoData = [
    { id: 1, title: "Todo 1", isDone: false, },
    { id: 2, title: "Todo 2", isDone: false, },
    { id: 3, title: "Todo 3", isDone: false, },
  ];

  const [todos, setTodos] = useState<TodoType[]>(todoData);
  const [todoText, setTodoText] = useState<string>('');

  const addTodo = () => {
    const newTodo: TodoType = {
      id: Math.random(),
      title: todoText,
      isDone: false,
    };

    todos.push(newTodo);
    setTodos(todos);
    setTodoText('');
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {alert('clicked')}}>
            <Ionicons name="menu" size={24} color={"#333"}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image 
              source={{uri:'https://icons.veryicon.com/png/o/miscellaneous/generic-icon-3/avatar-empty.png'}}  
              style={{width:40, height:40}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name='search' size={24} color={'#333'}/>
          <TextInput placeholder='Search' style={styles.searchInput} clearButtonMode='always'/>
        </View>

        <FlatList
          data={[...todos].reverse()}
          renderItem={({ item }) => (
            <TodoItem item={item} />
          )}
          keyExtractor={item => String(item.id)}
        />

        <KeyboardAvoidingView 
          style={styles.footer} 
          behavior='padding' 
          keyboardVerticalOffset={10} 
        >
          <TextInput 
            placeholder='Add item' 
            value={todoText}
            onChangeText={(text) => setTodoText(text)} 
            style={styles.newTodoInput} 
          />
          <TouchableOpacity style={styles.addButton} onPress={() => {addTodo()} }>
            <Ionicons name='add' size={24} color={'#ffffff'} />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const TodoItem = ({item}: {item: TodoType}) => (
  <View style={styles.todoContainer}>
    <View style={styles.todoInfoContainer}>
      <Checkbox value={item.isDone} color={item.isDone ? '#aaaaff' : undefined}/>
      <Text style={[styles.todoText, item.isDone && {textDecorationLine: 'line-through'}]}>{item.title}</Text>
    </View>
    <TouchableOpacity onPress={() => {}}>
      <Ionicons name='trash' size={24} color={'#ffaaaa'}/>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  todoContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todoInfoContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  todoText: {
    fontSize: 16,
    color: '#333'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newTodoInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    margin: 10,
    color: '#333 ',
    fontSize: 16
  },
  addButton: {
    backgroundColor: '#aaaaff',
    borderRadius: 10,
    padding: 8,
    marginLeft: 20,
  },
});