import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from 'expo-checkbox';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Confetti, ConfettiMethods } from 'react-native-fast-confetti';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type TodoType = {
  id: number;
  title: string;
  isDone: boolean;
}

export default function Index() {

  const confettiRef = useRef<ConfettiMethods>(null);

  const [todos, setTodos] = useState<TodoType[]>([]);
  const [oldTodos, setOldTodos] = useState<TodoType[]>([]);
  const [todoText, setTodoText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allDone, setAllDone] = useState<Boolean>(false);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem('my-todo');
        if (todos !== null) {
          setTodos(JSON.parse(todos));
          setOldTodos(JSON.parse(todos));
        }
      } catch (error) {
        console.log(error);
      }
    }
    getTodos();
  }, []);

  const addTodo = async () => {
    try {
      const newTodo: TodoType = {
        id: Math.random(),
        title: todoText,
        isDone: false,
      };

      oldTodos.push(newTodo);
      setOldTodos(oldTodos);
      await AsyncStorage.setItem('my-todo', JSON.stringify(todos));
      setTodoText('');
      setAllDone(false);
      Keyboard.dismiss();
      onSearch(searchQuery);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
      const newOldTodos = oldTodos.filter((todo) => todo.id !== id);
      setOldTodos(newOldTodos);
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
    } catch (error) {
      console.log(error);
    }
  }

  const handleDone = async (id: number) => {
    try {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone;
          if (!todo.isDone) {
            setAllDone(false);
          } else {
            checkAllDone();
          }
        }
        return todo;
      });
      setTodos(newTodos);
      setOldTodos(newTodos);
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
    } catch (error) {
      console.log(error);
    }
  }

  const onSearch = (query: string) => {
    if (query === "") {
      setTodos(oldTodos);
    } else {
      const filteredTodos = oldTodos.filter((todo) => todo.title.toLowerCase().includes(query.toLowerCase()));
      setTodos(filteredTodos);
    }
  }

  useEffect(() => {onSearch(searchQuery)}, [searchQuery]);

  const checkAllDone = () => {
    if (!allDone) {
      const done = todos.every(item => item.isDone);
      setAllDone(done);
      if (done) {
        spawnConfetti();
      }
    }
  }

  const spawnConfetti = () => {
    confettiRef.current?.restart();
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="menu" size={24} color={"#333"}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image 
              source={{uri:'https://icons.veryicon.com/png/o/miscellaneous/generic-icon-3/avatar-empty.png'}}  
              style={{width:40, height:40}}
            />
          </TouchableOpacity>
        </View>

        <Confetti ref={confettiRef} autoplay={false} fadeOutOnEnd={true} />

        <View style={styles.searchBar}>
          <Ionicons name='search' size={24} color={'#333'}/>
          <TextInput placeholder='Search' style={styles.searchInput} value={searchQuery} onChangeText={(text) => setSearchQuery(text)} clearButtonMode='always'/>
        </View>

        <FlatList
          data={[...todos].reverse()}
          renderItem={({ item }) => (
            <TodoItem item={item} deleteTodo={deleteTodo} handleDone={handleDone} />
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

const TodoItem = ({item, deleteTodo, handleDone}: {item: TodoType, deleteTodo: (id: number) => void, handleDone: (id:number) => void}) => (
  <View style={styles.todoContainer}>
    <View style={styles.todoInfoContainer}>
      <Checkbox value={item.isDone} onValueChange={() => handleDone(item.id)} color={item.isDone ? '#aaaaff' : undefined}/>
      <Text style={[styles.todoText, item.isDone && {textDecorationLine: 'line-through'}]}>{item.title}</Text>
    </View>
    <TouchableOpacity onPress={() => {deleteTodo(item.id)}}>
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