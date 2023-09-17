import { Field } from 'formik';
import { useFetchFilterOptionsQuery } from '../../store';
import Dropdown from '../Dropdown';

export default function Sources({ checkedSources }) {
    const { data, isLoading, error } = useFetchFilterOptionsQuery('sources');

    const checkedSourceLimit = 20;

    let content;

    if (isLoading) {
        content = <div className="ml-1">Loading Sources...</div>;
    } else if (error) {
        content = <div className="ml-1">Error at Fetching Sources</div>;
    } else {
        content = data?.fetch ? (
            data?.sources?.map((source) => {
                return (
                    <div key={source.id} className="flex items-center m-1">
                        <Field
                            type="checkbox"
                            name="sources"
                            id={source.id}
                            value={source.id}
                            className="ml-1"
                            disabled={
                                checkedSources.length >= checkedSourceLimit && checkedSources.indexOf(source.id) < 0
                            }
                        />
                        <label className="pl-2" htmlFor={source.id}>
                            {source.name}
                        </label>
                    </div>
                );
            })
        ) : (
            <div>{data?.error}</div>
        );
    }

    return (
        <div className="w-72 max-sm:mx-auto max-[340px]:w-full ">
            <Dropdown placeholder="Sources For NewsApi">{content}</Dropdown>
        </div>
    );
}
