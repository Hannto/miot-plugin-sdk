
import React from 'react';
import PropTypes from 'prop-types';
import { API_LEVEL, Package, Device, Service, Host } from 'miot';

import {
    requireNativeComponent, findNodeHandle,
    NativeModules,
    StyleSheet,
    View, ViewPropTypes, Text, Button
} from 'react-native';

import Orientation from 'react-native-orientation';

import { SafeAreaView } from 'react-native';

import RTSPRenderView from 'miot/ui/RTSPRenderView';

export default class RTSPPage extends React.Component {
    static navigationOptions = {
        headerTransparent: true
    };

    static propTypes = {
        isPlay: PropTypes.bool,
        isMute: PropTypes.bool,
        progress: PropTypes.number,
        duration: PropTypes.number,
        ...ViewPropTypes,
    };

    state = {
        isPlay: false,
        isMute: false,
        progress: 0,
        duration: 0,
        newProgress: 0,
    }

    componentDidMount() {
        this.props.navigation.setParams({
            title: "Camera Name",
            type: 'light',
            style: { backgroundColor: 'transparent' },
            onPressRight: () => {
                alert('asdf2');
                console.log("right menu")
            }
        })

        Orientation.lockToPortrait()

        /*
        that = this;
        DeviceEventEmitter.addListener(kConnectionCallBackName, function (connectionState) {
            console.log('reach connectionCallback get callback');
            console.log(connectionState);
            that.setState({
                pstate: connectionState.state,
                error: connectionState.error
            });
        });
        */
    }

    componentWillUnmount() {
        Orientation.lockToPortrait()
    }

    render() {
        return (
            <View style={styles.main}>
                <SafeAreaView style={{ backgroundColor: "black" }}></SafeAreaView>
                <RTSPRenderView
                    ref="rtspView"
                    style={styles.videoNormal}
                    isPlay={this.state.isPlay}
                    isMute={this.state.isMute}
                    progress={this.state.newProgress}
                    onChangeDuration={(e) =>
                        this.setState({
                            duration: e.nativeEvent.duration
                        })
                    }
                    onChangeProgress={(e) =>
                        this.setState({
                            progress: e.nativeEvent.progress
                        })
                    }
                >
                </RTSPRenderView>
                <View style={styles.videoToolBar}>
                    <Button style={styles.videoToolBarItem}
                        onPress={() => {
                            this.refs.rtspView.setPath("rtsp://192.168.1.105/mjcamera.mkv").then(() => {
                                alert('success');
                            }).catch(() => {
                                alert('fail');
                            });
                        }}
                        title="设置"
                    />
                    <Button style={styles.videoToolBarItem}
                        onPress={() => {
                            this.setState({
                                isPlay: !this.state.isPlay
                            })
                        }}
                        title={this.state.isPlay ? "暂停" : "播放"}
                    />
                    <Button style={styles.videoToolBarItem}
                        onPress={() => {
                            this.setState({
                                isMute: !this.state.isMute
                            })
                        }}
                        title={this.state.isMute ? "声音" : "静音"}
                    />
                    <Button style={styles.videoToolBarItem}
                        onPress={() => {
                            this.setState({
                                newProgress: this.state.progress + 10
                            })
                        }}
                        title="快进10"
                    />
                    <Text style={styles.videoToolBarItem}>
                        {this.state.progress} / { this.state.duration }
                    </Text>
                    <Button style={styles.videoToolBarItem}
                        onPress={()=>
                            Service.miotcamera.ffmpegCommand("ffmpeg -ss 00:00:00 -i %@ -b:v 2000K -vcodec copy -y %@").then((err) => {
                                console.log(err)
                            })
                        }
                        title="测试转码"
                    />
                </View>
                <SafeAreaView></SafeAreaView>
            </View>
        )
    }

    handleChange(event) {
        this.setState({
            progress: this.state.progress + 1
        })
        console.log(event)
    }
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        height: "100%",
    },

    videoNormal: {
        backgroundColor: 'black',
        flexDirection: "column",
        justifyContent: 'space-between',
        width: "100%",
        height: 250,
        //aspectRatio: 1920.0 / 1080.0
    },

    videoToolBar: {
        backgroundColor: '#EEE',
        alignSelf: "flex-end",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        height: 40
    },
    videoToolBarItem: {
        width: 0,
        flexGrow: 1,
        flexShrink: 1,
        borderRadius: 5,
        borderColor: 'red',
        borderWidth: 1,
        marginRight: 5,
    }
});