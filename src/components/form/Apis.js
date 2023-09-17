import { Field, ErrorMessage } from 'formik';
import { useFetchApisQuery } from '../../store';
import Dropdown from '../Dropdown';

export default function Apis() {
    const { data, isLoading, error } = useFetchApisQuery();

    let content;

    if (isLoading) {
        content = <div>Loading Apis...</div>;
    } else if (error) {
        content = <div>Error at Fetching Apis</div>;
    } else {
        content = data.apis.map((api) => {
            return (
                <div key={api._id}>
                    <Field type="checkbox" name="apis" id={api._id} value={api.name} className="ml-1" />
                    <label className="capitilize pl-2" htmlFor={api._id}>
                        {api.name}
                    </label>
                </div>
            );
        });
    }

    return (
        <div className="w-44 h-12 max-[340px]:mx-auto">
            <Dropdown placeholder="Select Api">{content}</Dropdown>
            <ErrorMessage name="apis" component="div" className="text-sm  text-red-500 h-6 text-center" />
        </div>
    );
}
