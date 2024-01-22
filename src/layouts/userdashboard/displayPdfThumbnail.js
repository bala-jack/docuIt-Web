import * as React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { version } from "pdfjs-dist";
import '@react-pdf-viewer/core/lib/styles/index.css';
import pageThumbnailPlugin from './pageThumbnailPlugin';

const DisplayThumbnail = ({ fileUrl, pageIndex }) => {
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Cover } = thumbnailPluginInstance;

    const renderThumbnailItem = (props) => {
        if (props.pageIndex === 0) {
            return (
                <div key={props.key}>
                    {props.renderPageThumbnail}
                </div>
            )
        }
    }
    const pageThumbnailPluginInstance = pageThumbnailPlugin({
        PageThumbnail: <Cover getPageIndex={() => 0} />,
    });
    console.log('fileUrl', fileUrl)
    return (
        <Worker workerUrl={`http://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`}>
            <Viewer fileUrl={fileUrl} plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]} />
        </Worker>
    );
};

export default DisplayThumbnail;