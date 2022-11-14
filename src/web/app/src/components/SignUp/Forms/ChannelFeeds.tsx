import RSSFeeds from './RSSFeeds';
import formModels from '../Schema/FormModel';

const { channels, allChannels, channelUrl, channelOwnership } = formModels;

const ChannelFeeds = () => {
  return (
    <RSSFeeds
      title="YouTube and Twitch"
      prompt="OPTIONAL: Enter your YouTube and/or Twitch channel"
      buttonText="Validate"
      helperText="Validate your channel(s)"
      feeds={{
        selected: channels.name as any,
        discovered: allChannels.name as any,
      }}
      agreement={{
        name: channelOwnership.name,
        label: channelOwnership.label,
      }}
      input={{
        name: channelUrl.name,
        label: channelUrl.label,
      }}
    />
  );
};

export default ChannelFeeds;
