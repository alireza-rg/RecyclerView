import React, { Component, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    NativeEventEmitter,
    NativeModules,
} from 'react-native';
import { RecyclerView, DataSource } from './list';

var _gCounter = 1;
function newItem() {
    return {
        id: _gCounter++,
        counter: 0
    };
}


export default function App() {
    let data = Array(50).fill().map((e, i) => newItem())
    const dataSource = new DataSource(data, (item, index) => item.id)
    function addToBottom(size) {
        var currCount = dataSource.size();
        var newItems = Array(size).fill().map((e, i) => newItem());
        dataSource.splice(currCount, 0, ...newItems);
    }
    useEffect(() => {
        const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
        let eventListener = eventEmitter.addListener('EventReminder', event => {
            console.log('event.onEndReached', event.onEndReached);
            if (event.onEndReached) {
                addToBottom(10)
            }
        });

        // Removes the listener once unmounted
        return () => {
            eventListener.remove();
        };
    }, []);
    const renderItem = ({ item, index }) => {
        return (
            <ItemView
                item={item}
                index={index} 
            />
        );
    }
    return (
        <View style={styles.container}>
            <RecyclerView
                style={{ flex: 1 }}
                dataSource={dataSource}
                renderItem={renderItem}
                inverted={false}
                // ListHeaderComponent={(
                //     <View style={{ paddingTop: 15, backgroundColor: '#aaa' }} />
                // )}
                // ListFooterComponent={(
                //     <View style={{ paddingTop: 15, backgroundColor: '#aaa' }} />
                // )}
                // ListEmptyComponent={(
                //     <View style={{ borderColor: '#e7e7e7', borderWidth: 1, margin: 10, padding: 20, }}>
                //         <Text style={{ fontSize: 15 }}>Empty Component</Text>
                //     </View>
                // )}
                ItemSeparatorComponent={(
                    <View style={{ borderBottomWidth: 1, borderColor: '#e7e7e7', marginHorizontal: 5, marginVertical: 10 }} />
                )}
            />
        </View>
    );
}

const ItemView = (props) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5 }}>
            <View style={{ flex: 1 }}>
                <Text style={{
                    fontSize: 16,
                    color: 'black'
                }}>Item #{props.item.id}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

