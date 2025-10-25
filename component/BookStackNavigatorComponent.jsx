import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookshelfScreenComponent from './BookshelfScreenComponent';
import BookScreenComponent from './BookScreenComponent';
import ChaptersScreenComponent from './ChaptersScreenComponent';
import ChapterContentScreenComponent from './ChapterContentScreenComponent';
import { useI18n } from '.././context/I18nContext'; 

const BooksStack = createNativeStackNavigator();

const BookStackNavigatorComponent = () => {

  const { language, setLanguage, translate } = useI18n();
  
  return (
    <BooksStack.Navigator>
      <BooksStack.Screen name="MyBookshelf" 
        options = {{
          title: translate('bookshelf'),
          headerTitleAlign: 'center',
        }}
        component={BookshelfScreenComponent} />
      <BooksStack.Screen name="Book" component={BookScreenComponent} />
      <BooksStack.Screen name="Chapters" component={ChaptersScreenComponent} />
      <BooksStack.Screen name="ChapterContent" component={ChapterContentScreenComponent} />
    </BooksStack.Navigator>
  );
};

export default BookStackNavigatorComponent;