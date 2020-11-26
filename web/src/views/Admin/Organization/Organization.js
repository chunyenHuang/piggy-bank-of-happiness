import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import VerticalTabs from 'components/Tab/VerticalTabs';
import OrganizationCard from 'components/Card/OrganizationCard';
import OrganizationPrincipalCard from 'components/Card/OrganizationPrincipalCard';
import OrganizationApplicantCard from 'components/Card/OrganizationApplicantCard';
import FileViewer from 'components/FileViewer';

import { request } from 'utilities/graph';
import { getOrganization } from 'graphql/queries';

export default function Organization({ id: inId, computedMatch }) {
  const [id, setId] = useState();
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    if (inId) {
      setId(inId);
    } else
    if (computedMatch) {
      const { params: { id } } = computedMatch;
      setId(id);
    }
  }, [inId, computedMatch]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data: { getOrganization: data } } = await request(getOrganization, { id });

      const tabs = [
        {
          label: '基本資料',
          component: <div>
            <OrganizationCard title="基本資料" data={data} />
            <br />
            <OrganizationPrincipalCard title="負責人" data={data.principal} />
            <br />
            <OrganizationApplicantCard title="申請人" data={data.user || { username: data.username }} />
          </div>,
        },
        {
          label: '文件',
          component: <FileViewer s3Prefix={`organizations/${data.id}/documents/`}/>,
        },
      ];
      setTabs(tabs);
    })();
  }, [id]);

  if (!id) {
    return null;
  }

  return (
    <VerticalTabs
      tabs={tabs}
    />
  );
}

Organization.propTypes = {
  id: PropTypes.string,
  computedMatch: PropTypes.shape({
    params: PropTypes.object,
  }),
};
