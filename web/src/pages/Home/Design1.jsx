/*
Copyright (C) 2025 QuantumNous — Mirage 幻境 Design 1: 赛博梦境 (Cyber Mirage)
SPDX-License-Identifier: AGPL-3.0-or-later
*/

import React, { useContext, useEffect, useState } from 'react';
import { ScrollList, ScrollItem } from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Moonshot, OpenAI, XAI, Zhipu, Volcengine, Cohere, Claude, Gemini,
  Suno, Minimax, Wenxin, Spark, Qingyan, DeepSeek, Qwen, Midjourney,
  Grok, AzureAI, Hunyuan, Xinference,
} from '@lobehub/icons';
import {
  Zap, CreditCard, Copy, Check, Terminal, KeyRound, FileText, Github,
  Sparkles, Gauge, ShieldCheck, Workflow, ArrowRight,
} from 'lucide-react';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isChinese = i18n.language.startsWith('zh');

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) content = marked.parse(data);
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') setNoticeVisible(true);
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };
    checkNoticeAndShow();
  }, []);

  useEffect(() => { displayHomePageContent(); }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  // Scope vaporwave chrome to header/footer only while the neon homepage is shown.
  const showNeonHome = homePageContentLoaded && homePageContent === '';
  useEffect(() => {
    if (!showNeonHome) return;
    document.body.classList.add('mirage-neon-page');
    return () => document.body.classList.remove('mirage-neon-page');
  }, [showNeonHome]);

  const providerLogos = [
    Moonshot, OpenAI, XAI, Zhipu, Volcengine, Cohere, Claude, Gemini,
    Suno, Minimax, Wenxin, Spark, Qingyan, DeepSeek, Qwen, Midjourney,
    Grok, AzureAI, Hunyuan, Xinference,
  ];

  const stats = [
    { value: '200+', label: isChinese ? '可用模型' : 'Models' },
    { value: '30+',  label: isChinese ? '上游供应商' : 'Providers' },
    { value: '99.9%', label: isChinese ? '可用性' : 'Uptime' },
    { value: '<80ms', label: isChinese ? '首字延迟' : 'TTFT' },
  ];

  const features = [
    {
      icon: <Gauge size={20} />,
      title: isChinese ? '极速通道' : 'Fast Lane',
      desc: isChinese ? '智能路由 + 全球加速节点，毫秒级首字响应。' : 'Smart routing across global edge for ms-grade TTFT.',
    },
    {
      icon: <Workflow size={20} />,
      title: isChinese ? '统一协议' : 'One Protocol',
      desc: isChinese ? '只需替换 base url，原生兼容 OpenAI / Claude / Gemini 协议。' : 'Drop-in replacement — OpenAI / Claude / Gemini compatible.',
    },
    {
      icon: <ShieldCheck size={20} />,
      title: isChinese ? '稳定可靠' : 'Built to Last',
      desc: isChinese ? '多上游热切换，自动重试、降级与配额隔离。' : 'Multi-upstream failover with retry, downgrade and quota isolation.',
    },
  ];

  if (showNeonHome) {
    return (
      <div className='mirage-neon-root'>
        <NoticeModal visible={noticeVisible} onClose={() => setNoticeVisible(false)} isMobile={isMobile} />

        <div className='mirage-scanlines' />
        <div className='mirage-bg-layers'>
          <div className='mirage-sun-orb' />
          <div className='mirage-grid-floor' />
          <div className='mirage-stars' />
        </div>

        <section className='mirage-hero'>
          <div className='mirage-terminal-tag'>
            <Terminal size={14} />
            <span>SYSTEM.ONLINE — {serverAddress.replace(/^https?:\/\//, '')}</span>
            <span className='mirage-dot-blink' />
          </div>

          <div className='mirage-hero-title-block'>
            <h1 className='mirage-title'>
              <span className='mirage-title-kanji' aria-label='幻境'>
                <span>幻</span><span>境</span>
              </span>
              <span className='mirage-title-gradient'>MirageAI</span>
            </h1>
            <p className='mirage-subtitle'>
              <span className='mirage-bracket'>⌜</span>
              {isChinese ? '统一的大模型接口网关 · 一处接入 · 万象皆通' : 'A unified gateway for every large model.'}
              <span className='mirage-bracket'>⌝</span>
            </p>
          </div>

          <div className='mirage-url-bar'>
            <div className='mirage-url-prefix'>$</div>
            <div className='mirage-url-track'>
              <span className='mirage-url-host'>{serverAddress.replace(/\/$/, '')}</span>
              <span className='mirage-url-sep'>›</span>
              <div className='mirage-url-endpoint'>
                <ScrollList bodyHeight={26} style={{ border: 'unset', boxShadow: 'unset', background: 'transparent' }}>
                  <ScrollItem
                    mode='wheel'
                    cycled={true}
                    list={endpointItems}
                    selectedIndex={endpointIndex}
                    onSelect={({ index }) => setEndpointIndex(index)}
                  />
                </ScrollList>
              </div>
            </div>
            <button className='mirage-url-copy' onClick={handleCopyBaseURL} title='Copy'>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          <div className={`mirage-cta-row ${isMobile ? 'mirage-cta-mobile' : ''}`}>
            <Link to='/console' className='mirage-btn mirage-btn-primary'>
              <span className='mirage-btn-inner'>
                <KeyRound size={16} />
                <span>{t('获取密钥')}</span>
              </span>
            </Link>

            <div className='mirage-cta-featured'>
              <div className='mirage-cta-featured-row'>
                <Link to='/aiplanhub' className='mirage-btn mirage-btn-accent'>
                  <span className='mirage-btn-inner'>
                    <Zap size={16} />
                    <span>{isChinese ? 'AI 订阅方案对比' : 'AI Plan Compare'}</span>
                  </span>
                </Link>
                <a href='https://pay.ldxp.cn/shop/mirage' target='_blank' rel='noopener noreferrer' className='mirage-btn mirage-btn-outline'>
                  <span className='mirage-btn-inner'>
                    <CreditCard size={16} />
                    <span>{t('充值')}</span>
                  </span>
                </a>
              </div>
            </div>

            {isDemoSiteMode && statusState?.status?.version ? (
              <button
                className='mirage-btn mirage-btn-ghost'
                onClick={() => window.open('https://github.com/QuantumNous/new-api', '_blank')}
              >
                <span className='mirage-btn-inner'>
                  <Github size={16} />
                  <span>{statusState.status.version}</span>
                </span>
              </button>
            ) : (
              docsLink && (
                <button className='mirage-btn mirage-btn-ghost' onClick={() => window.open(docsLink, '_blank')}>
                  <span className='mirage-btn-inner'>
                    <FileText size={16} />
                    <span>{t('文档')}</span>
                  </span>
                </button>
              )
            )}
          </div>

          <div className='mirage-stats'>
            {stats.map((s, i) => (
              <div key={i} className='mirage-stat'>
                <div className='mirage-stat-value'>{s.value}</div>
                <div className='mirage-stat-label'>{s.label}</div>
                {i < stats.length - 1 && <div className='mirage-stat-divider' />}
              </div>
            ))}
          </div>
        </section>

        <section className='mirage-features'>
          {features.map((f, i) => (
            <div key={i} className='mirage-feature-card'>
              <div className='mirage-feature-icon-diamond'>{f.icon}</div>
              <h3 className='mirage-feature-title'>{f.title}</h3>
              <p className='mirage-feature-desc'>{f.desc}</p>
              <span className='mirage-feature-id'>0{i + 1}</span>
            </div>
          ))}
        </section>

        <section className='mirage-final-cta'>
          <div className='mirage-final-cta-inner'>
            <div className='mirage-final-cta-text'>
              <p className='mirage-final-cta-line1'>{isChinese ? '> 入幻境 · 唤万模' : '> ENTER THE MIRAGE'}</p>
              <h2 className='mirage-final-cta-line2'>
                {isChinese ? '万千模型，一处召唤。' : 'Summon every model, from one place.'}
              </h2>
            </div>
            <Link to='/console' className='mirage-btn mirage-btn-primary mirage-btn-lg'>
              <span className='mirage-btn-inner'>
                <span>{isChinese ? '进入控制台' : 'Open Console'}</span>
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </section>

        <section className='mirage-providers'>
          <div className='mirage-providers-label'>
            <Sparkles size={14} />
            <span>{t('支持众多的大模型供应商')}</span>
          </div>
          <div className='mirage-providers-window'>
            <div className='mirage-window-bar'>
              <span className='mirage-dot mirage-dot-pink' />
              <span className='mirage-dot mirage-dot-cyan' />
              <span className='mirage-dot mirage-dot-orange' />
              <span className='mirage-window-title'>upstream://providers — {providerLogos.length}+</span>
            </div>
            <div className='mirage-providers-grid'>
              {providerLogos.map((Logo, i) => {
                const hasColor = typeof Logo.Color === 'function';
                return (
                  <div key={i} className='mirage-provider-icon' title={Logo?.displayName || ''}>
                    {hasColor ? <Logo.Color size={isMobile ? 26 : 32} /> : <Logo size={isMobile ? 26 : 32} />}
                  </div>
                );
              })}
              <div className='mirage-provider-count'><span>30+</span></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className='w-full overflow-x-hidden'>
      <NoticeModal visible={noticeVisible} onClose={() => setNoticeVisible(false)} isMobile={isMobile} />
      {homePageContent.startsWith('https://') ? (
        <iframe src={homePageContent} className='w-full h-screen border-none' />
      ) : (
        <div className='mt-[60px]' dangerouslySetInnerHTML={{ __html: homePageContent }} />
      )}
    </div>
  );
};

export default Home;
