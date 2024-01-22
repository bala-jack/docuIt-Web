import './pageThumbanail.css'
const pageThumbnailPlugin = (props)=> {
    const { PageThumbnail } = props;

    return {
        renderViewer: (renderProps) => {
            let { slot } = renderProps;

            slot.children = PageThumbnail;

            // Reset the sub slot
            slot.subSlot.attrs = {};
            slot.subSlot.children = <></>;

            return slot;
        },
    };
};

export default pageThumbnailPlugin;