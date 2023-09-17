import { Field } from 'formik';
import { useFetchFilterOptionsQuery } from '../../store';
import Dropdown from '../Dropdown';
import { memo } from 'react';

function Sections({ selectedSection }) {
    const { data, isLoading, error } = useFetchFilterOptionsQuery('sections');

    let content;

    if (isLoading) {
        content = <div className="ml-1">Loading Sections...</div>;
    } else if (error) {
        content = <div className="ml-1">Error at Fetching Sections</div>;
    } else {
        content = data?.fetch ? (
            [{ id: 'all', webTitle: 'all' }, ...data?.sections].map((section, index) => {
                return (
                    <div key={section.id} className="flex items-center m-1">
                        <Field type="radio" name="section" id={section.id} value={section.id} className="ml-1" />
                        <label className="pl-2" htmlFor={section.id}>
                            {section.webTitle}
                        </label>
                    </div>
                );
            })
        ) : (
            <div>{data?.error}</div>
        );
    }

    return (
        <div className="w-72 max-sm:mx-auto max-[340px]:w-full max-sm:mt-1">
            <Dropdown placeholder={selectedSection || 'Sections For Guardians'}>{content}</Dropdown>
        </div>
    );
}

export default memo(Sections);
