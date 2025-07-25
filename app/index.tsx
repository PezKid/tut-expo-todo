import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const todoData = [
    { id: 1, title: "Todo 1", isDone: false, },
    { id: 2, title: "Todo 2", isDone: false, },
    { id: 3, title: "Todo 3", isDone: false, },
    { id: 4, title: "Todo 4", isDone: false, },
    { id: 5, title: "Todo 5", isDone: false, },
    { id: 6, title: "Todo 6", isDone: false, },
    { id: 7, title: "Todo 7", isDone: false, },
    { id: 8, title: "Todo 8", isDone: false, },
    { id: 9, title: "Todo 9", isDone: false, },
  ]

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
        <FlatList
          data={todoData}
          renderItem={({ item }) => (
            <View>
              <Text>{item.title}</Text>
            </View>
          )}
          keyExtractor={item => String(item.id)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

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
});