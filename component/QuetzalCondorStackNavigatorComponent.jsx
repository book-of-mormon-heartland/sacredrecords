import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenComponent from './HomeScreenComponent';
//import BookScreenComponent from './BookScreenComponent';
import QuetzalBooksScreenComponent from './QuetzalBooksScreenComponent';
import QzBookScreenComponent from './QzBookScreenComponent';
import QzChaptersScreenComponent from './QzChaptersScreenComponent';
import QzChapterContentScreenComponent from './QzChapterContentScreenComponent';
import { useI18n } from '.././context/I18nContext'; 

const BooksStack = createNativeStackNavigator();

const QuetzalCondorStackNavigatorComponent = () => {

  const { language, setLanguage, translate } = useI18n();
  
  return (
    <BooksStack.Navigator>
      <BooksStack.Screen name="QuetzalBookshelf" options = {{
          title: translate('quetzal_condor_council'),
          headerTitleAlign: 'center',
        }} component={QuetzalBooksScreenComponent} />
      <BooksStack.Screen name="QzBook" component={QzBookScreenComponent} />
      <BooksStack.Screen name="QzChapters" component={QzChaptersScreenComponent} />
      <BooksStack.Screen name="QzChapterContent" options = {{
        title: translate('chapter')
      }} component={QzChapterContentScreenComponent} />
    </BooksStack.Navigator>
  );
};

export default QuetzalCondorStackNavigatorComponent;


/*
    <BooksStack.Navigator>
      <BooksStack.Screen name="MyBookshelf" 
        options = {{
          title: translate('bookshelf'),
        }}
        component={BookshelfScreenComponent} />
      <BooksStack.Screen name="Book" component={BookScreenComponent} />
      <BooksStack.Screen name="Chapters" component={ChaptersScreenComponent} />
      <BooksStack.Screen name="ChapterContent" component={ChapterContentScreenComponent} />
    </BooksStack.Navigator>


*/