/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useEffect,useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  ActivityIndicator,
  Button
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import SplashScreen from 'react-native-splash-screen';

import CodePush from "react-native-code-push";


console.log({SplashScreen});


// const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const App = () => {

  const [receivedBytes,set_receivedBytes] = useState(0);
  const [totalBytes,set_totalBytes] = useState(0);
  const [showProcess,set_showProcess] = useState(false);
  const [showIndicator,set_showIndicator] = useState(false);


  const _handleUpdate = async ()=>{
    set_showIndicator(true);
    const updateMessage = await CodePush.checkForUpdate() || {};
    console.log({updateMessage});

    await CodePush.sync(
     
      {

        installMode: CodePush.InstallMode.ON_NEXT_RESUME,

        mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,

        //更新确认弹窗设置，设置系统自带弹窗中的内容
        updateDialog:{
          mandatoryUpdateMessage:'强制更新内容: '+updateMessage.description,
          mandatoryContinueButtonLabel:'强制更新/确认',
          optionalIgnoreButtonLabel:'取消',
          optionalInstallButtonLabel:'安装',
          optionalUpdateMessage:'本次更新内容: '+updateMessage.description,
          title:'发现新版本'
        }},
   
      //0 已经是最新，1 安装完成、等待生效，2 忽略更新，3 未知错误，4 已经在下载了，5 查询更新，6 弹出了更新确认界面，7 下载中，8下载完成
      (status)=>{

        switch (status){
          case 0: alert('已经是最新版本');
            break;
          case 1 : !updateMessage.isMandatory && alert('更新完成, 再启动APP更新即生效');
            break;
          case 3: alert('出错了，未知错误');
            break;
          case 7 : set_showProcess(true);
            break;
          case 8 : set_showProcess(false);
            break;
        }
      },
      ({receivedBytes,totalBytes})=>{
        // console.log('DownloadProgress: ', receivedBytes, totalBytes);
        // this.setState({receivedBytes: (receivedBytes/1024).toFixed(2), totalBytes: (totalBytes/1024).toFixed(2)})
        set_receivedBytes((receivedBytes/1024).toFixed(2));
        set_totalBytes((totalBytes/1024).toFixed(2));
      });

      set_showIndicator(false);

  }

  const handleUpdate = () => _handleUpdate().catch(()=>{
    set_showIndicator(false);
    alert('网络错误')
  });

  useEffect(()=>{
    SplashScreen.hide();
  },[]);

  return (
    <>
      <View style={styles.container}>
        <StatusBar
          backgroundColor={'#4f6d7a'}
          barStyle={'light-content'}
        />
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>

        {
          !showIndicator
          ? <Button title={'update'} onPress={handleUpdate} color={Platform.OS === 'ios' ? '#fff' : '#000'}/>
          : <ActivityIndicator size={'large'} color={'#fff'}/>
        }

        {
          showProcess && <Text style={styles.ratio}>
            下载进度：{receivedBytes} kb / {totalBytes} kb
            {'\n'}
            完成率: {receivedBytes / totalBytes * 100 || 0}%
          </Text>
        }

      </View>
    </>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#f5fcff',
  },
  instructions: {
    textAlign: 'center',
    color: '#f5fcff',
    marginBottom: 5,
  },
  ratio:{
    fontSize:20,
    color:'#fff'
  }
});

export default App;
