import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useSearchMutation } from '../../store';
import NewsList from './NewsList';
import Apis from '../form/Apis';
import Sections from '../form/Sections';
import Sources from '../form/Sources';
import SaveSettings from '../SaveSettings';

export default function Search() {
    const user = useSelector(({ user }) => user);
    const [search, searchResult] = useSearchMutation();

    const formSchema = Yup.object().shape({
        searchTerm: Yup.string()
            .required('Term required')
            .max(100, ({ max }) => `Maximum ${max} character`),
        apis: Yup.mixed().test('api-required', 'Select Minimum 1 Api', (value) => value.length > 0),
    });

    return (
        <div>
            <div>
                <Formik
                    initialValues={{
                        searchTerm: '',
                        fromDate: user?.settings?.fromDate || '',
                        toDate: user?.settings?.toDate || new Date().toISOString().split('T')[0],
                        apis: user?.settings?.apis?.length > 0 ? user?.settings?.apis : [],
                        sources: user?.settings?.sources?.length > 0 ? user?.settings?.sources : [],
                        section: user?.settings?.section || '',
                    }}
                    validationSchema={formSchema}
                    onSubmit={(values) => {
                        search({
                            ...values,
                            searchTerm: values.searchTerm.toLocaleLowerCase(),
                            section: values.section === 'all' ? '' : values.section,
                        });
                    }}
                >
                    {({ values, isValid, dirty }) => (
                        <>
                            <Form>
                                <div>
                                    <div className="flex flex-wrap gap-2 justify-center items-center px-2 max-[340px]:block mt-2">
                                        <div className="w-full max-w-[30rem] h-12">
                                            <Field
                                                type="text"
                                                name="searchTerm"
                                                id="searchTerm"
                                                placeholder="Search Term"
                                                className="w-full border-2 px-1"
                                                onKeyDown={(e) => {
                                                    e.key === 'Enter' && e.preventDefault();
                                                }}
                                            />
                                            <ErrorMessage
                                                name="searchTerm"
                                                component="div"
                                                className="text-sm  text-red-500 h-6"
                                            />
                                        </div>
                                        <div className="flex h-12 max-[340px]:block max-[340px]:h-20 max-[340px]:text-center">
                                            <div>
                                                <label htmlFor="fromDate">From: </label>
                                                <Field
                                                    type="date"
                                                    name="fromDate"
                                                    id="fromDate"
                                                    className="border-2"
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div className="ml-2 max-[340px]:mt-2">
                                                <label htmlFor="toDate">To: </label>
                                                <Field
                                                    type="date"
                                                    name="toDate"
                                                    id="toDate"
                                                    className="border-2"
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                        </div>
                                        <Apis />
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-2 px-2 max-sm:block">
                                        {values.apis.indexOf('newsapi') > -1 && (
                                            <Sources checkedSources={values.sources} />
                                        )}
                                        {values.apis.indexOf('theguardians') > -1 && (
                                            <Sections selectedSection={values.section} />
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-center max-[300px]:block max-[300px]:text-center mt-2">
                                    <button
                                        type="submit"
                                        className={`w-36 h-7 rounded-md text-white disabled:cursor-not-allowed ${
                                            isValid && dirty ? 'bg-green-400' : 'bg-red-500'
                                        }`}
                                        disabled={searchResult.isLoading || !(isValid && dirty)}
                                    >
                                        {searchResult.isLoading ? 'Seaching...' : 'Search'}
                                    </button>
                                    {user?.id && <SaveSettings settings={values} />}
                                </div>
                            </Form>
                        </>
                    )}
                </Formik>
            </div>
            <NewsList searchResult={searchResult} />
        </div>
    );
}
