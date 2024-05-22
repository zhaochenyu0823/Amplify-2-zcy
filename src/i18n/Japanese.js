import { I18n } from '@aws-amplify/core';


const dict = {
  ja: {
    'Sign In': 'サインイン',
    'Sign in': '登録',
    'Sign Up': 'サインアップ',
    'Email': 'メール',
    'Password': 'パスワード',
    'Confirm Password': 'パスワード再確認',
    'Enter your Email': 'メールを入力してください',
    'Enter your Password': 'パスワードを入力してください',
    'Please confirm your Password': 'パスワードを再入力してください',
    'No account?': 'アカウントがありませんか？',
    'Create Account': 'アカウントを作成',
    'Forgot your password?': 'パスワードを忘れましたか？',
    'Reset password': 'パスワードをリセット',
    'Username': 'ユーザー名',
    'Name': '名前'
  }
};

I18n.putVocabularies(dict);
I18n.setLanguage('ja');
