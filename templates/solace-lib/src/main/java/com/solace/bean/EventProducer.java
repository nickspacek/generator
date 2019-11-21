package com.solace.bean;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.solace.bean.event.TestEvent;
import com.solacesystems.jcsmp.JCSMPFactory;
import com.solacesystems.jcsmp.JCSMPSession;
import com.solacesystems.jcsmp.TextMessage;
import com.solacesystems.jcsmp.Topic;
import com.solacesystems.jcsmp.XMLMessageProducer;

@Component
public class EventProducer {

	@Autowired
	private SolaceSession solaceSession;

	private ObjectMapper mapper = new ObjectMapper();
	private TextMessage textMessage = JCSMPFactory.onlyInstance().createMessage(TextMessage.class);

	private XMLMessageProducer producer;

	@PostConstruct
	public void init() throws Exception {
		JCSMPSession session = solaceSession.getSession();
		producer = session.getMessageProducer(new PublishEventHandler());
	}

{%- for schemaName, schema in asyncapi.components().schemas() %}
{%- set lowerName = schemaName | lowerFirst %}

	public void send({{ schemaName }} {{ lowerName}}, String topicName) throws Exception {
		Topic topic = solaceSession.getTopic(topicName);
		String payload = mapper.writeValueAsString({{ lowerName }});
		textMessage.setText(payload);
		producer.send(textMessage, topic);
	}
	
 {% endfor %}
	public void close() {
		solaceSession.close();
	}

}
