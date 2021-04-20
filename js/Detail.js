import React, { Component } from 'react';
import getTime from './tools/getTime';
import {
    TouchableOpacity,
    View,
    StyleSheet,
    TextInput,
    Alert,
    AsyncStorage,
    Button,
    DeviceEventEmitter
} from "react-native";

export default class DetailsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            msgText: '',
            tag: 0
        }
    }
    render() {
        const { navigation } = this.props;
        //navigationのヘッド設定
        navigation.setOptions({
            title: "詳細",
            headerRight: () => (
                <Button onPress={saveBtnClick} title="保存" color="red">
                </Button >
            )
        })

        //保存ボタンクリック後、このメソッド実行
        const saveBtnClick = () => {
            if (this.props.route.params.stas === "create") {
                this.props.route.params.createTag("create");
                this._setMessage(this.state.msgText)
            } else if (this.props.route.params.stas === "update") {
                const stas = this.props.route.params.stas;
                const idx = this.props.route.params.idx;
                const allary = [{ tepSta: stas }, { temIdx: idx }]
                this.props.route.params.updateTag(allary);
                if (this.state.msgText === '') {
                    if (this.state.tag === 0) {
                        this._setMessage(this.props.route.params.content)
                    } else {
                        this._setMessage(this.state.msgText)
                    }
                } else {
                    this._setMessage(this.state.msgText)
                }
            }
            //前の画面に戻る
            navigation.goBack();
        }

        return (
            <View>
                <TextInput
                    style={styles.textInputStyle}
                    multiline={true}
                    defaultValue={this.props.route.params.content ? this.props.route.params.content : this.state.text}
                    placeholder="メッセージ入力してください"
                    onChangeText={(text) => {
                        this.setState({ tag: 1 })
                        this.setState({ msgText: text });
                    }}
                />
            </View >
        );
    }

    //入力した情報を保存する
    _setMessage(objMsg) {
        AsyncStorage.setItem('content', objMsg, (error) => {
            if (error) {
                alert(error)
            }
        });
        DeviceEventEmitter.emit('notic', "message");
    }
}

//stylesの設定
const styles = StyleSheet.create({
    textInputStyle: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        fontSize: 15
    },
});