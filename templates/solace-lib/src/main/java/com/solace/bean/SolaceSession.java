package com.solace.bean;

import java.util.HashMap;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.solacesystems.jcsmp.JCSMPFactory;
import com.solacesystems.jcsmp.JCSMPSession;
import com.solacesystems.jcsmp.SpringJCSMPFactory;
import com.solacesystems.jcsmp.Topic;

@Component
public class SolaceSession {

	@Autowired
	private SpringJCSMPFactory springJCSMPFactory;
	private JCSMPSession session;
	private HashMap<String, Topic> topics = new HashMap<>();

	@PostConstruct
	public void init() throws Exception {
		session = springJCSMPFactory.createSession();
	}

	public JCSMPSession getSession() {
		return session;
	}

	public Topic getTopic(String topicName) {
		Topic topic = topics.get(topicName);

		if (topic == null) {
			topic = JCSMPFactory.onlyInstance().createTopic(topicName);
			topics.put(topicName, topic);
		}

		return topic;
	}

	public void close() {
		if (!session.isClosed()) {
			session.closeSession();
		}
	}
}
