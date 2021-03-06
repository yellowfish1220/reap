var TopicWebAPIUtils = require('../utils/TopicWebAPIUtils');
var alt = require('../alt');
/*
 * Declaring TopicActions using ES2015. This is equivalent to creating
 * function TopicActions() {}
 * AND
 * TopicActions.prototype.create() = function(data) {}
 */
class TopicActions {

  /*
   * @param text that user wishes to save
   */
  create(text) {
    var id;
    var data;
    // Remove whitespace
    if (text.trim().length > 0) {
      // Using the current timestamp in place of a real id.
      id = Date.now().toString();
      data = {
        id: id,
        count: 1,
        text: text
      };

      // This dispatches for views to make optimistic updates
      this.dispatch(data);
      // Makes an additional call to the server API and actually adds the topic
      TopicWebAPIUtils.addTopic(data)
        .done(function(res) {
          // We might not need to do anything it successfully added due to optimistic updates.
          console.log(res);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          // dispatch an event if fails to notify user that it has failed
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        });
    }
  }

  /*
   * @param String topic id to increment with
   */
  increment(id) {
    this.dispatch(id);

    TopicWebAPIUtils.updateTopic({ id: id }, false, true);
  }

  /*
   * @param String topic id to decrement with
   */
  decrement(id) {
    this.dispatch(id);

    TopicWebAPIUtils.updateTopic({ id: id }, false, false);
  }

  /*
   * @param String topic id to destroy
   */
  destroy(id) {
    this.dispatch(id);

    // Keeping it consistent with the above
    TopicWebAPIUtils.deleteTopic({id: id});
  }

  /*
   *  @param String text that user is typing in input field
   */
  typing(text) {
    this.dispatch(text);
  }

}

module.exports = alt.createActions(TopicActions);
